const fs = require('fs');
const path = require('path');

const files = [
  'c:\\Users\\MUKSOFT\\Documents\\quiz culture\\anime-quiz.html',
  'c:\\Users\\MUKSOFT\\Documents\\quiz culture\\culture-quiz.html',
  'c:\\Users\\MUKSOFT\\Documents\\quiz culture\\drama-quiz.html',
  'c:\\Users\\MUKSOFT\\Documents\\quiz culture\\cinema-quiz.html'
];

files.forEach(file => {
  try {
    let text = fs.readFileSync(file, 'utf8');
    const m = text.match(/const\s+questions\s*=\s*\[(.*?)\];/s);
    if (!m) {
      console.log('No questions array found in', file);
      return;
    }
    let questionsBlock = m[1];
    // Replace each question object's correct numeric value
    const questionRegex = /\{([\s\S]*?)\}(?=\s*,?\s*\n)/g;
    let changed = false;
    questionsBlock = questionsBlock.replace(questionRegex, (qblock) => {
      // find options array
      const optionsMatch = qblock.match(/options\s*:\s*\[([\s\S]*?)\]/);
      const correctMatch = qblock.match(/correct\s*:\s*(\d+)/);
      if (optionsMatch && correctMatch) {
        const optsRaw = optionsMatch[1];
        // parse options: split on commas not inside quotes
        const opts = [];
        const re = /("[^"]*"|'[^']*')/g;
        let m2;
        while ((m2 = re.exec(optsRaw)) !== null) {
          const s = m2[1];
          opts.push(s.slice(1, -1));
        }
        const num = parseInt(correctMatch[1], 10);
        let idx = num;
        if (num >= 1 && num <= opts.length) idx = num - 1;
        if (idx >= 0 && idx < opts.length) {
          const replacement = `correct: \"${opts[idx].replace(/\\/g, '\\\\').replace(/\"/g, '\\"')}\"`;
          changed = true;
          return qblock.replace(/correct\s*:\s*\d+/, replacement);
        }
      }
      return qblock;
    });
    if (changed) {
      const newQuestions = `const questions = [${questionsBlock}\n        ];`;
      text = text.replace(/const\s+questions\s*=\s*\[([\s\S]*?)\];/s, newQuestions);
      fs.writeFileSync(file, text, 'utf8');
      console.log('Updated', file);
    } else {
      console.log('No numeric correct entries found in', file);
    }
  } catch (e) {
    console.error('Error processing', file, e.message);
  }
});
