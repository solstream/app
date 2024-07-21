const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.html');

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    return console.error('Error reading index.html:', err);
  }

  const result = data.replace(/media="print"/g, 'media="all"');

  fs.writeFile(indexPath, result, 'utf8', (err) => {
    if (err) {
      return console.error('Error writing index.html:', err);
    }
    console.log('index.html has been updated to media="all".');
  });
});
