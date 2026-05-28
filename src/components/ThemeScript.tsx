/** Runs before paint to apply saved theme / mode / audience and avoid flash. */
export default function ThemeScript() {
  const script = `
(function() {
  try {
    var valid = ['classic','fancy','neon','minimal','dark','vibrant','glassmorphism','retro','relax'];
    var stored = localStorage.getItem('sahara-theme') || 'classic';
    var t = valid.indexOf(stored) >= 0 ? stored : 'classic';
    var ld = localStorage.getItem('sahara-light-dark') || 'dark';
    var a = localStorage.getItem('sahara-audience') || 'kid';
    var root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.setAttribute('data-light-dark', ld);
    root.setAttribute('data-audience', a);
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
