import fs from 'fs';

const path = 'src/app/videos/VideosHub.tsx';
let s = fs.readFileSync(path, 'utf8');

if (!s.includes('mix }')) {
  s = s.replace(
    "import { themeInline as C } from '@/lib/themeTokens';",
    "import { themeInline as C, mix } from '@/lib/themeTokens';"
  );
}

const map = [
  ['deep', 'e6', 90], ['deep', 'ee', 93], ['deep', 'cc', 80], ['deep', 'dd', 87],
  ['deep', '88', 53], ['deep', '55', 33], ['deep', '44', 27], ['deep', '33', 20],
  ['mid', '55', 33], ['mid', '66', 40], ['mid', '44', 27], ['mid', '33', 20],
  ['mid', '22', 13], ['mid', '18', 9],
  ['soft', '55', 33], ['soft', '44', 27], ['soft', '33', 20], ['soft', '18', 9],
  ['ink', '99', 60], ['ink', 'aa', 67], ['ink', 'ee', 93], ['ink', 'dd', 87],
  ['gold', '55', 33], ['gold', '44', 27], ['gold', '22', 13],
];

for (const [token, suffix, pct] of map) {
  const bad = `\${C.${token}}${suffix}`;
  const good = `\${mix(C.${token}, ${pct})}`;
  s = s.split(bad).join(good);
}

s = s.replace(
  'linear-gradient(120deg, ${C.deep}dd 0%, ${C.mid}99 50%, ${C.ink}ee 100%)',
  'linear-gradient(120deg, ${mix(C.deep, 87)} 0%, ${mix(C.mid, 60)} 50%, ${mix(C.ink, 93)} 100%)'
);

fs.writeFileSync(path, s);
console.log('Done. Remaining bad patterns:', (s.match(/\$\{C\.\w+\}[0-9a-f]{2}/g) || []).length);
