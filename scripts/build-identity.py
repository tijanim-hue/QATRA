from pathlib import Path
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile

root=Path(__file__).resolve().parents[1]
baseline=json.loads((root/'.github/qatra-update-baseline.json').read_text())
expected=baseline['certificate_sha256'].lower()
def invoke(args):
    environment=dict(os.environ,LC_ALL='C',LANG='C')
    result=subprocess.run([str(x) for x in args],stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=environment)
    if result.returncode:
        output=(result.stdout+b'\n'+result.stderr).decode(errors='replace')
        raise SystemExit('Tool failed: '+str(args[0])+'\n'+output)
    return result
def run(args):
    return invoke(args).stdout
def require(ok,message):
    if not ok:
        raise SystemExit(message)

if sys.argv[1]=='prepare':
    key=(Path.home()/'.android/debug.keystore').resolve()
    require(key.is_file(),'Persistent keystore missing. Refusing to generate a replacement.')
    with tempfile.TemporaryDirectory(prefix='qatra-public-cert-') as folder:
        certificate=Path(folder)/'certificate.der'
        run(['keytool','-exportcert','-keystore',key,'-storepass','android','-alias','androiddebugkey','-file',certificate])
        require(certificate.is_file() and certificate.stat().st_size>0,'Certificate export produced no DER file.')
        actual=hashlib.sha256(certificate.read_bytes()).hexdigest()
    print('Pinned signing-line certificate SHA-256: '+expected,flush=True)
    print('Exported certificate SHA-256: '+actual,flush=True)
    require(actual==expected,'Signing certificate differs from the pinned signing line. No replacement key will be generated.')
    number=int(os.environ['GITHUB_RUN_NUMBER'])
    attempt=int(os.environ.get('GITHUB_RUN_ATTEMPT','1'))
    require(number>0 and 1<=attempt<100,'Build counter outside supported range.')
    code=100000+number*100+attempt
    require(code<=2100000000,'Android versionCode limit reached.')
    gradle=root/'android/app/build.gradle'
    text=gradle.read_text()
    require(len(re.findall(r'\bapplicationId\s+"'+re.escape(baseline['application_id'])+'"',text))==1,'Application ID differs from baseline.')
    text,n=re.subn(r'\bversionCode\s+\d+',f'versionCode {code}',text)
    require(n==1,'Version code configuration is ambiguous.')
    text,n=re.subn(r'\bversionName\s+"[^"]+"',f'versionName "1.0.{number}.{attempt}"',text)
    require(n==1,'Version name configuration is ambiguous.')
    gradle.write_text(text)
    with open(os.environ['GITHUB_ENV'],'a') as out:
        out.write(f'QATRA_VERSION_CODE={code}\n')
        out.write(f'QATRA_KEYSTORE_FILE={key}\n')
    print('Persistent signing line matched; versionCode='+str(code))
    transition=baseline.get('transition',{})
    if transition.get('requires_reinstall_from_previous_signing_line'):
        print('NOTICE: This line is not an in-place update for the previous d4bb signing certificate. No uninstall is authorized by this build.')
elif sys.argv[1]=='verify':
    sdk=Path(os.environ.get('ANDROID_HOME') or os.environ['ANDROID_SDK_ROOT'])
    tools=[p for p in (sdk/'build-tools').iterdir() if (p/'apksigner').is_file() and (p/'aapt').is_file()]
    require(bool(tools),'Android APK identity tools unavailable.')
    tools.sort(key=lambda p:tuple(int(x) for x in re.findall(r'\d+',p.name)))
    tool=tools[-1]
    apk=root/'android/app/build/outputs/apk/debug/app-debug.apk'
    result=invoke([tool/'apksigner','verify','--verbose','--print-certs',apk])
    signature=(result.stdout+b'\n'+result.stderr).decode(errors='replace')
    print('apksigner public verification output:\n'+signature,flush=True)
    pattern=r'^[ \t]*(?:V\d+(?:\.\d+)?[ \t]+)?Signer\b[^\r\n]*?\bcertificate[ \t]+SHA-?256[ \t]+digest[ \t]*:[ \t]*([0-9a-fA-F: \t]+)[ \t]*$'
    values=re.findall(pattern,signature,flags=re.I|re.M)
    require(bool(values),'Unable to extract a certificate SHA-256 from apksigner output. This is a parsing failure, not proof of a certificate mismatch. Artifact publication blocked.')
    signers=[re.sub(r'[: \t]','',value).lower() for value in values]
    require(all(re.fullmatch(r'[0-9a-f]{64}',value) for value in signers),'Invalid certificate fingerprint format. Artifact publication blocked.')
    counts=re.findall(r'^[ \t]*Number of signers:[ \t]*(\d+)[ \t]*$',signature,flags=re.I|re.M)
    require(all(int(count)==1 for count in counts),'Unexpected signer count. Artifact publication blocked.')
    actual=set(signers)
    print('Pinned signing-line certificate SHA-256: '+expected,flush=True)
    print('APK certificate SHA-256: '+', '.join(sorted(actual)),flush=True)
    require(actual=={expected},'APK signing certificate differs from the pinned line. Artifact publication blocked.')
    metadata=run([tool/'aapt','dump','badging',apk]).decode()
    package=re.search(r"package: name='([^']+)' versionCode='(\d+)'",metadata)
    require(package is not None,'Unable to read APK package identity.')
    application,code=package.group(1),int(package.group(2))
    require(application==baseline['application_id'],'APK application ID changed. Artifact publication blocked.')
    require(code==int(os.environ['QATRA_VERSION_CODE']),'APK versionCode differs from the assigned build counter.')
    reference=baseline.get('reference_version_code')
    require(reference is None or code>reference,'APK is not newer than the signing-line reference.')
    report={'application_id':application,'signing_line':baseline.get('signing_line'),'version_code':code,'certificate_sha256':next(iter(actual)),'apk_sha256':hashlib.sha256(apk.read_bytes()).hexdigest(),'commit':os.environ.get('GITHUB_SHA'),'reference_version_code':reference,'transition':baseline.get('transition',{}),'note':'Certificate and package checks do not constitute an installation test, a backup verification, or authorization to uninstall the previous app.'}
    (root/'qatra-build-identity.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
else:
    raise SystemExit('Expected prepare or verify.')
