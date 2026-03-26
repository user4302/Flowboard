const fs = require('fs');
const path = require('path');

// Read coverage data
const coverageData = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

// Get all source files (excluding node_modules, coverage, etc.)
function getSourceFiles() {
  const srcDir = 'src';
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== '__tests__') {
        walkDir(fullPath);
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(srcDir);
  return files;
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

// Count lines of code
function countLOC(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    // Filter out empty lines and comment-only lines
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
    });
    return codeLines.length;
  } catch (error) {
    return 0;
  }
}

// Calculate coverage percentage
function calculateCoverage(filePath) {
  const coverage = coverageData[path.resolve(filePath)];
  if (!coverage) return 0;
  
  const statements = coverage.s || {};
  const totalStatements = Object.keys(statements).length;
  if (totalStatements === 0) return 0;
  
  const coveredStatements = Object.values(statements).filter(count => count > 0).length;
  return Math.round((coveredStatements / totalStatements) * 100);
}

// Main analysis
const sourceFiles = getSourceFiles();
const results = [];

for (const file of sourceFiles) {
  const coverage = calculateCoverage(file);
  const loc = countLOC(file);
  const hasTest = hasTestFile(file);
  
  results.push({
    filePath: file.replace('src/', ''),
    coverage,
    loc,
    hasTest
  });
}

// Sort by coverage (ascending), then by LOC (descending)
results.sort((a, b) => {
  if (a.coverage !== b.coverage) {
    return a.coverage - b.coverage;
  }
  return b.loc - a.loc;
});

// Calculate groups
const totalFiles = results.length;
const groupSize = Math.max(1, Math.round(totalFiles / 10));
const groups = [];

for (let i = 0; i < totalFiles; i += groupSize) {
  const group = results.slice(i, i + groupSize);
  const avgCoverage = Math.round(group.reduce((sum, file) => sum + file.coverage, 0) / group.length);
  groups.push({
    groupNumber: Math.floor(i / groupSize) + 1,
    files: group,
    avgCoverage
  });
}

// Output tables
console.log('\n=== COVERAGE ANALYSIS RESULTS ===\n');

console.log('All Files (sorted by coverage %, then LOC):');
console.log('| File Path | Coverage % | Lines of Code | Test File Exists? |');
console.log('|-----------|------------|---------------|-------------------|');
results.forEach(file => {
  console.log(`| ${file.filePath} | ${file.coverage}% | ${file.loc} | ${file.hasTest ? 'Yes' : 'No'} |`);
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
  console.log(`- ${file.filePath}: ${file.coverage}% (${file.loc} LOC)`);
});
