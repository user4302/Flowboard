const fs = require('fs');

// Read coverage data
const coverageData = JSON.parse(fs.readFileSync('scripts/all-coverage-files.json', 'utf8'));

// Group 2: Files 17-32 (next lowest coverage after Group 1)
const group2Start = 16; // 0-indexed, so 16 is the 17th file
const group2End = 31;   // 0-indexed, so 31 is the 32nd file

const group2Files = coverageData.slice(group2Start, group2End + 1);

console.log('=== GROUP 2 FILES (NEXT LOWEST COVERAGE) ===\n');
console.log(`Files ${group2Start + 1}-${group2End + 1} out of ${coverageData.length} total files\n`);

let totalStatements = 0;
let totalCovered = 0;

group2Files.forEach((file, index) => {
  const actualIndex = group2Start + index + 1;
  console.log(`${actualIndex}. ${file.path}: ${file.coverage}% (${file.covered}/${file.statements} statements)`);
  
  totalStatements += file.statements;
  totalCovered += file.covered;
});

const avgCoverage = totalStatements > 0 ? ((totalCovered / totalStatements) * 100).toFixed(2) : '0.00';
console.log(`\nGroup 2 Summary: ${group2Files.length} files, avg ${avgCoverage}% coverage`);
console.log(`Total statements: ${totalCovered}/${totalStatements}`);

// Save Group 2 files for reference
fs.writeFileSync('group2-files.json', JSON.stringify(group2Files, null, 2));
console.log('\nSaved Group 2 files to group2-files.json');
