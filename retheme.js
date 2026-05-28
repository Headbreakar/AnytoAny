const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = [...walk('app'), ...walk('components')];

const replacements = [
  { search: /text-white/g, replace: 'text-stone-900' },
  { search: /text-slate-400/g, replace: 'text-stone-600' },
  { search: /text-slate-300/g, replace: 'text-stone-700' },
  { search: /text-slate-500/g, replace: 'text-stone-500' },
  { search: /bg-white\/5/g, replace: 'bg-stone-900/5' },
  { search: /hover:bg-white\/5/g, replace: 'hover:bg-stone-900/5' },
  { search: /bg-white\/10/g, replace: 'bg-stone-900/10' },
  { search: /border-white\/[0-9.]+/g, replace: 'border-stone-900/15' },
  { search: /bg-bg-dark\//g, replace: 'bg-white/' },
];

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  
  // Fixes for buttons and gradients where we still want white text
  // Example: text-stone-900 inside bg-gradient-to-r or bg-primary
  content = content.replace(/(from-primary[^\s>]*\s+[^>]*?)text-stone-900/g, '$1text-white');
  content = content.replace(/(bg-primary[^\s>]*\s+[^>]*?)text-stone-900/g, '$1text-white');
  // Also any button with text-stone-900 and primary might need to be fixed manually, but this regex handles many cases.
  content = content.replace(/text-stone-900(\s+[^>]*?bg-primary)/g, 'text-white$1');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    changedCount++;
    console.log('Updated', file);
  }
});

console.log(`Updated ${changedCount} files.`);
