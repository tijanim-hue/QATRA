from pathlib import Path
import hashlib
import json
import os
import re
import subprocess
import sys

root=Path(__file__).resolve().parents[1]
baseline=json.loads((root/'.github/qatra-update-baseline.json').read_text())
expected=baseline['certificate_sha256'].lower()
def run(args):
    return subprocess.check_output([str(x) for x in args],stderr=subprocess.STDOUT)
def require(ok,message):
    if not ok:
        raise SystemExit(message)

if sys.argv[1]=='prepare':
    key=Path.home()/'.android/debug.keystore'
    require(key.is_file(),'Persistent keystore missing. Refusing to generate a replacement.')
    certificate=run(['keytool','-exportcert','-keystore',key,'-storepass','android','-alias','androiddebugkey'])
    actual=hashlib.sha256(certificate).hexdigest()
    require(actual==expected,'Signing certificate differs from the user APK baseline. No replacement key will be generated.')
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
    print('Baseline signing certificate matched; versionCode='+str(code))
elif sys.argv[1]=='verify':
    sdk=Path(os.environ.get('ANDROID_HOME') or os.environ['ANDROID_SDK_ROOT'])
    tools=[p for p in (sdk/'build-tools').iterdir() if (p/'apksigner').is_file() and (p/'aapt').is_file()]
    require(bool(tools),'Android APK identity tools unavailable.')
    tools.sort(key=lambda p:tuple(int(x) for x in re.findall(r'\d+',p.name)))
    tool=tools[-1]
    apk=root/'android/app/build/outputs/apk/debug/app-debug.apk'
    signature=run([tool/'apksigner','verify','--verbose','--print-certs',apk]).decode()
    signers=re.findall(r'Signer #\d+ certificate SHA-256 digest:\s*([0-9a-fA-F]{64})',signature)
    require([s.lower() for s in signers]==[expected],'APK signing certificate differs from baseline. Artifact publication blocked.')
    metadata=run([tool/'aapt','dump','badging',apk]).decode()
    package=re.search(r"package: name='([^']+)' versionCode='(\d+)'",metadata)
    require(package is not None,'Unable to read APK package identity.')
    application,code=package.group(1),int(package.group(2))
    require(application==baseline['application_id'],'APK application ID changed. Artifact publication blocked.')
    require(code==int(os.environ['QATRA_VERSION_CODE']),'APK versionCode differs from the assigned build counter.')
    reference=baseline.get('reference_version_code')
    require(reference is None or code>reference,'APK is not newer than the reference.')
    report={'application_id':application,'version_code':code,'certificate_sha256':expected,'apk_sha256':hashlib.sha256(apk.read_bytes()).hexdigest(),'commit':os.environ.get('GITHUB_SHA'),'reference_version_code':reference,'note':'Reference APK versionCode was not present in the supplied certificate output. Installation over the existing app is not tested by this check.'}
    (root/'qatra-build-identity.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
else:
    raise SystemExit('Expected prepare or verify.')
