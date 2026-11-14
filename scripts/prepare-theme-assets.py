import copy
import json
import pathlib
import struct

root = pathlib.Path(__file__).resolve().parents[1]
public = root / 'public'
report = []
for i in range(1, 9):
    path = public / 'assets' / 'qatra-skins' / f'qatra-theme-{i:02d}.png'
    with path.open('rb') as stream:
        header = stream.read(24)
    if header[:8] != b'\x89PNG\r\n\x1a\n' or header[12:16] != b'IHDR':
        raise SystemExit(f'Invalid PNG: {path.name}')
    width, height = struct.unpack('>II', header[16:24])
    report.append({'file': path.name, 'width': width, 'height': height, 'bytes': path.stat().st_size})

app = public / 'app.js'
source = app.read_text(encoding='utf-8')
marker = '// === QATRA PACKAGE TWO SKINS BEGIN ==='
start = source.index('const themes=', source.index(marker)) + len('const themes=')
themes, length = json.JSONDecoder().raw_decode(source[start:])
if len(themes) != 7:
    raise SystemExit('Expected the existing seven-theme configuration; refusing an ambiguous update.')
eighth = copy.deepcopy(themes[-1])
eighth['label'] = 'الثيم الثامن'
themes.append(eighth)
for i, theme in enumerate(themes, 1):
    theme['image'] = f'assets/qatra-skins/qatra-theme-{i:02d}.png'
    theme['wall'] = f'url("{theme["image"]}") center top / 100% auto no-repeat, {theme["vars"]["bgsolid"]}'
source = source[:start] + json.dumps(themes, ensure_ascii=False, separators=(',', ':')) + source[start + length:]
app.write_text(source, encoding='utf-8')

css = public / 'package2-skins.css'
css.write_text(css.read_text(encoding='utf-8') + '''
/* Full artwork includes both inner and outer decorations. Render it once. */
.app-container.q2-home #surpriseButton .q2-scene{display:none!important}
.app-container.q2-home #surpriseButton{background:transparent!important;border-color:transparent!important;box-shadow:none!important}
.app-container.q2-home #surpriseButton::before,.app-container.q2-home #surpriseButton::after,.app-container.q2-home #surpriseButton .surprise-orbit{display:none!important}
''', encoding='utf-8')
(root / 'theme-assets-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
