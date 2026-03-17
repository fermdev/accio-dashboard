const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Workspace.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(
  /\{customizer\?\.selectedBg === 'bg2' && \(\s*<div className="absolute inset-0 bg-gradient-to-r from-white\/10 via-white\/5 to-transparent to-60%"><\/div>\s*\)\}/,
  `{customizer?.selectedBg === 'bg2' && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-red-500/10 to-transparent to-60%"></div>
          )}`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Replaced bg2 gradient');
