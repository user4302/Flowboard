const fs = require('fs');

// Read coverage data
const coverageData = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

// Files we tested
const testedFiles = [
  'D:\\Projects\\Web\\NextJS\\flowboard\\src\\components\\boardShare\\components\\MemberManagement\\MemberTabs.tsx',
  'D:\\Projects\\Web\\NextJS\\flowboard\\src\\lib\\invitation-utils.ts',
  'D:\\Projects\\Web\\NextJS\\flowboard\\src\\hooks\\useDragAndDrop.ts'
];

console.log('=== COVERAGE FOR TESTED FILES ===\n');

testedFiles.forEach(filePath => {
  const coverage = coverageData[filePath];

  if (coverage) {
    const statements = Object.keys(coverage.s).length;
    const covered = Object.values(coverage.s).filter(count => count > 0).length;
    const percentage = statements > 0 ? ((covered / statements) * 100).toFixed(2) : '0.00';

    // Extract relative path for display
    const relativePath = filePath.replace('D:\\Projects\\Web\\NextJS\\flowboard\\', '');

    console.log(`${relativePath}:`);
    console.log(`  Statements: ${covered}/${statements} (${percentage}%)`);
    console.log(`  Functions: ${Object.values(coverage.f).filter(count => count > 0).length}/${Object.keys(coverage.f).length}`);
    console.log(`  Branches: ${Object.values(coverage.b).flat().filter(count => count > 0).length}/${Object.values(coverage.b).flat().length}`);
    console.log('');
  } else {
    const relativePath = filePath.replace('D:\\Projects\\Web\\NextJS\\flowboard\\', '');
    console.log(`${relativePath}: No coverage data found\n`);
  }
});
