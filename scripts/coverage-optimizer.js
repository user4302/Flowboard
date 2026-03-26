const fs = require('fs');
const path = require('path');

// Read the coverage data
const coverageData = JSON.parse(fs.readFileSync('all-coverage-files.json', 'utf8'));

// Helper function to count lines of code
function countLOC(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
    });
    return codeLines.length;
  } catch (error) {
    return 0;
  }
}

// Check if test file exists
function hasTestFile(filePath) {
  const testPatterns = [
    filePath.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1'),
    filePath.replace(/\.(ts|tsx|js|jsx)$/, '.spec.$1'),
    path.join(path.dirname(filePath), '__tests__', path.basename(filePath).replace(/\.(ts|tsx|js|jsx)$/, '.test.$1'))
  ];
  
  return testPatterns.some(pattern => fs.existsSync(pattern));
}

// Enhance coverage data with LOC and test file info
const enhancedData = coverageData.map(file => ({
  ...file,
  loc: countLOC(file.path),
  hasTest: hasTestFile(file.path),
  coverage: Math.round(file.coverage * 100) / 100 // Round to 2 decimal places
}));

// Sort by coverage (ascending), then by LOC (descending)
enhancedData.sort((a, b) => {
  if (a.coverage !== b.coverage) {
    return a.coverage - b.coverage;
  }
  return b.loc - a.loc;
});

// Calculate groups
const totalFiles = enhancedData.length;
const groupSize = Math.max(1, Math.round(totalFiles / 10));
const groups = [];

for (let i = 0; i < totalFiles; i += groupSize) {
  const group = enhancedData.slice(i, i + groupSize);
  const avgCoverage = Math.round((group.reduce((sum, file) => sum + file.coverage, 0) / group.length) * 100) / 100;
  groups.push({
    groupNumber: Math.floor(i / groupSize) + 1,
    files: group,
    avgCoverage
  });
}

// Output results
console.log('\n=== COVERAGE OPTIMIZATION ANALYSIS ===\n');

console.log('All Files (sorted by coverage %, then LOC):');
console.log('| File Path | Coverage % | Lines of Code | Test File Exists? |');
console.log('|-----------|------------|---------------|-------------------|');
enhancedData.forEach(file => {
  const relativePath = file.path.replace(/\\/g, '/');
  console.log(`| ${relativePath} | ${file.coverage}% | ${file.loc} | ${file.hasTest ? 'Yes' : 'No'} |`);
});

console.log('\n=== GROUPED BY COVERAGE ===\n');
console.log('| Group # | Files (count) | Avg Group Coverage |');
console.log('|---------|---------------|-------------------|');
groups.forEach(group => {
  console.log(`| ${group.groupNumber} | ${group.files.length} files | ${group.avgCoverage}% |`);
});

console.log('\n=== FOCUSING ON GROUP 1 (LOWEST COVERAGE) ===\n');
const group1 = groups[0];
console.log(`Group 1: ${group1.files.length} files, avg ${group1.avgCoverage}% → Target 90%+`);
console.log('\nFiles in Group 1:');
group1.files.forEach(file => {
  const relativePath = file.path.replace(/\\/g, '/');
  console.log(`- ${relativePath}: ${file.coverage}% (${file.loc} LOC, ${file.statements} statements)`);
});

// Save group 1 details for test generation
fs.writeFileSync('group1-files.json', JSON.stringify(group1.files, null, 2));
console.log('\nSaved Group 1 files to group1-files.json');

// Generate summary statistics
const zeroCoverage = enhancedData.filter(f => f.coverage === 0);
const lowCoverage = enhancedData.filter(f => f.coverage < 25);
const mediumCoverage = enhancedData.filter(f => f.coverage >= 25 && f.coverage < 75);
const highCoverage = enhancedData.filter(f => f.coverage >= 75);

console.log('\n=== COVERAGE SUMMARY ===\n');
console.log(`Total source files: ${totalFiles}`);
console.log(`Zero coverage files: ${zeroCoverage.length}`);
console.log(`Low coverage files (<25%): ${lowCoverage.length}`);
console.log(`Medium coverage files (25-75%): ${mediumCoverage.length}`);
console.log(`High coverage files (>=75%): ${highCoverage.length}`);

const avgCoverage = Math.round((enhancedData.reduce((sum, file) => sum + file.coverage, 0) / totalFiles) * 100) / 100;
console.log(`Overall average coverage: ${avgCoverage}%`);
