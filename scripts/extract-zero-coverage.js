const fs = require('fs');
const path = require('path');

// Read the coverage file
const coverageData = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

const allFiles = [];

// Iterate through all files in coverage data
for (const [filePath, data] of Object.entries(coverageData)) {
  // Calculate total statements and covered statements
  const totalStatements = Object.keys(data.statementMap || {}).length;
  const coveredStatements = Object.values(data.s || {}).filter(count => count > 0).length;

  // Calculate coverage percentage
  const coverage = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 100; // If no statements, consider 100%

  // Only include files that are actual source files (not in node_modules or test files)
  if ((filePath.includes('src/') || filePath.includes('src\\')) &&
    !filePath.includes('__tests__') &&
    !filePath.includes('.test.') &&
    !filePath.includes('.spec.') &&
    !filePath.includes('node_modules') &&
    totalStatements > 0) {

    // Convert to relative path from project root
    const relativePath = path.relative(process.cwd(), filePath);

    allFiles.push({
      path: relativePath,
      statements: totalStatements,
      covered: coveredStatements,
      coverage: coverage
    });
  }
}

// Sort by coverage (ascending)
allFiles.sort((a, b) => a.coverage - b.coverage);

// Output results
console.log('All source files by coverage (lowest first):');
console.log('==============================================');
allFiles.forEach(file => {
  console.log(`${file.path}: ${file.coverage.toFixed(2)}% (${file.covered}/${file.statements} statements)`);
});

console.log(`\nTotal source files: ${allFiles.length}`);

// Find files with less than 50% coverage
const lowCoverageFiles = allFiles.filter(file => file.coverage < 50);
console.log(`\nFiles with less than 50% coverage: ${lowCoverageFiles.length}`);

// Find files with less than 25% coverage  
const veryLowCoverageFiles = allFiles.filter(file => file.coverage < 25);
console.log(`Files with less than 25% coverage: ${veryLowCoverageFiles.length}`);

// Find files with zero coverage
const zeroCoverageFiles = allFiles.filter(file => file.coverage === 0);
console.log(`Files with zero coverage: ${zeroCoverageFiles.length}`);

if (zeroCoverageFiles.length > 0) {
  console.log('\nZero coverage files:');
  zeroCoverageFiles.forEach(file => {
    console.log(`  ${file.path} (${file.statements} statements)`);
  });
}

// Save the complete list
fs.writeFileSync('all-coverage-files.json', JSON.stringify(allFiles, null, 2));
console.log('\nSaved complete coverage data to all-coverage-files.json');
