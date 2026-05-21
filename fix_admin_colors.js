import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const dirsToProcess = [
  path.resolve(__dirname, 'src/app/admin'),
  path.resolve(__dirname, 'src/components/admin'),
  path.resolve(__dirname, 'src/components/AdminBottomTabNav.tsx'),
  path.resolve(__dirname, 'src/components/AdminLetterEditor.tsx')
];

const processFiles = (files) => {
  files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // text-white/XX -> text-foreground/XX
        content = content.replace(/text-white\/([0-9\.]+)/g, 'text-foreground/$1');
        
        // border-white/XX -> border-foreground/XX
        content = content.replace(/border-white\/([0-9\.]+)/g, 'border-foreground/$1');
        
        // bg-white/XX -> bg-foreground/XX
        content = content.replace(/bg-white\/([0-9\.]+)/g, 'bg-foreground/$1');
        content = content.replace(/bg-white\/\[([0-9\.]+)\]/g, 'bg-foreground/[$1]');

        // bg-black/XX -> bg-foreground/5
        content = content.replace(/bg-black\/[0-9]+/g, 'bg-foreground/5');

        // text-white -> text-foreground (if not part of a primary button)
        content = content.replace(/className=(["'{`])([^"'{`]+)(["'{`])/g, (match, p1, classes, p3) => {
            let classList = classes.split(/\s+/);
            let hasPrimaryBg = classList.some(c => c.includes('bg-primary') || c.includes('bg-secondary') || c.includes('gradient-bg') || c.includes('bg-green-') || c.includes('bg-red-') || c.includes('bg-amber-'));
            
            if (!hasPrimaryBg) {
                classes = classes.replace(/\btext-white\b/g, 'text-foreground');
            }
            return `className=${p1}${classes}${p3}`;
        });
        
        // specific text-black / bg-white fixes
        content = content.replace(/\btext-black\b/g, 'text-background');
        content = content.replace(/\bbg-white\b(?!(\/|\]|\[))/g, 'bg-foreground');

        if (original !== content) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated', file);
        }
    } catch (e) {
        console.error('Error with', file, e);
    }
  });
};

let allFiles = [];
let pendingDirs = dirsToProcess.length;

dirsToProcess.forEach(item => {
  fs.stat(item, (err, stat) => {
    if (stat && stat.isDirectory()) {
      walk(item, (err, res) => {
        allFiles = allFiles.concat(res);
        if (!--pendingDirs) processFiles(allFiles);
      });
    } else if (stat && stat.isFile()) {
      allFiles.push(item);
      if (!--pendingDirs) processFiles(allFiles);
    } else {
      if (!--pendingDirs) processFiles(allFiles);
    }
  });
});
