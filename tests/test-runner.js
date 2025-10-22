#!/usr/bin/env node

// Typosquatting Detection Stress Test Runner
// Runs automated tests against the detection algorithm

// Import test data
const { testCases } = require('./test-data.js');

// Import detection algorithm components
// We need to simulate the browser environment for the extension code
const fs = require('fs');
const path = require('path');

// Logging configuration
const LOGS_DIR = path.join(__dirname, 'logs');

/**
 * Ensure logs directory exists
 */
function ensureLogsDirectory() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

/**
 * Generate log filename with timestamp
 */
function generateLogFilename() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `test-run-${timestamp}.log`;
}

/**
 * Create log content from test results
 */
function createLogContent(results, startTime, endTime) {
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  // Count by attack type
  const attackTypes = {};
  results.forEach(r => {
    if (r.attackType) {
      attackTypes[r.attackType] = attackTypes[r.attackType] || { total: 0, passed: 0 };
      attackTypes[r.attackType].total++;
      if (r.passed) attackTypes[r.attackType].passed++;
    }
  });
  
  let log = '';
  log += '================================================================================\n';
  log += '                    TYPOSQUATTING DETECTION TEST LOG\n';
  log += '================================================================================\n';
  log += `Test Run Date: ${new Date(startTime).toLocaleString('en-US', { 
    dateStyle: 'full', 
    timeStyle: 'long' 
  })}\n`;
  log += `Duration: ${duration}s\n`;
  log += `Total Tests: ${total}\n`;
  log += `Passed: ${passed} (${passRate}%)\n`;
  log += `Failed: ${failed} (${(100 - passRate).toFixed(1)}%)\n`;
  log += '\n';
  
  // Overall assessment
  if (passRate >= 95) {
    log += 'Overall Assessment: ✓ EXCELLENT - Detection system performing very well!\n';
  } else if (passRate >= 80) {
    log += 'Overall Assessment: ⚠ GOOD - Detection system working but has room for improvement.\n';
  } else {
    log += 'Overall Assessment: ✗ NEEDS IMPROVEMENT - Detection system requires attention.\n';
  }
  log += '\n';
  
  log += '================================================================================\n';
  log += '                         RESULTS BY ATTACK TYPE\n';
  log += '================================================================================\n';
  Object.entries(attackTypes).forEach(([type, stats]) => {
    const typePassRate = ((stats.passed / stats.total) * 100).toFixed(1);
    log += `${type.padEnd(30)} ${stats.passed}/${stats.total} (${typePassRate}%)\n`;
  });
  log += '\n';
  
  log += '================================================================================\n';
  log += '                           DETAILED TEST RESULTS\n';
  log += '================================================================================\n';
  results.forEach((result, index) => {
    const status = result.passed ? 'PASS' : 'FAIL';
    log += `#${String(index + 1).padStart(3, '0')} [${status}] ${result.domain.padEnd(40)} `;
    log += `Expected: ${result.expected.padEnd(12)} Detected: ${result.detected.padEnd(12)} `;
    log += `${result.attackType || 'N/A'}\n`;
  });
  log += '\n';
  
  // Failed tests section
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    log += '================================================================================\n';
    log += `                      FAILED TESTS (${failedTests.length})\n`;
    log += '================================================================================\n';
    failedTests.forEach((result, index) => {
      log += `\n${index + 1}. ${result.domain}\n`;
      log += `   Expected: ${result.expected}\n`;
      log += `   Detected: ${result.detected}\n`;
      log += `   Attack Type: ${result.attackType || 'N/A'}\n`;
      log += `   Target: ${result.targetInstitution || 'N/A'}\n`;
      
      if (result.detectionResult) {
        log += `   Detection Details:\n`;
        log += `     - Similarity: ${result.detectionResult.similarity?.toFixed(1) || 0}%\n`;
        log += `     - Patterns: ${JSON.stringify(result.detectionResult.patterns || {})}\n`;
      }
    });
    log += '\n';
  }
  
  log += '================================================================================\n';
  log += '                              END OF LOG\n';
  log += '================================================================================\n';
  
  return log;
}

/**
 * Save log to file
 */
function saveLog(logContent) {
  ensureLogsDirectory();
  const filename = generateLogFilename();
  const filepath = path.join(LOGS_DIR, filename);
  
  fs.writeFileSync(filepath, logContent, 'utf8');
  
  return { filename, filepath };
}

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Progress bar characters
const progressChars = {
  full: '█',
  empty: '░',
};

/**
 * Load and execute extension code in Node.js context
 */
function loadExtensionCode() {
  // Create a mock window object for the extension code
  global.window = {};
  
  // Load institutions database (from parent directory)
  const institutionsCode = fs.readFileSync(
    path.join(__dirname, '..', 'institutions.js'),
    'utf8'
  );
  eval(institutionsCode);
  
  // Make legitimateInstitutions globally available for the detector
  global.legitimateInstitutions = global.window.legitimateInstitutions;
  
  // Load typosquatting detector (from parent directory)
  const detectorCode = fs.readFileSync(
    path.join(__dirname, '..', 'typosquatting-detector.js'),
    'utf8'
  );
  eval(detectorCode);
  
  return {
    legitimateInstitutions: global.window.legitimateInstitutions,
    checkForTyposquatting: global.window.checkForTyposquatting,
  };
}

/**
 * Run a single test case
 */
function runTest(testCase, checkForTyposquatting, legitimateInstitutions) {
  const { domain, expected, attackType, targetInstitution } = testCase;
  
  // Check if domain is legitimate
  const isLegitimate = legitimateInstitutions.hasOwnProperty(domain);
  
  let detected = 'unknown';
  let detectionResult = null;
  
  if (isLegitimate) {
    detected = 'legitimate';
  } else {
    // Run typosquatting detection
    detectionResult = checkForTyposquatting(domain);
    if (detectionResult.suspicious) {
      detected = 'suspicious';
    } else if (detectionResult.status === 'legitimate') {
      // Domain is a legitimate subdomain (e.g., particulares.santander.pt)
      detected = 'legitimate';
    }
  }
  
  // Determine if test passed
  const passed = detected === expected;
  
  return {
    domain,
    expected,
    detected,
    passed,
    attackType,
    targetInstitution,
    detectionResult,
  };
}

/**
 * Display progress bar
 */
function displayProgress(current, total) {
  const percentage = Math.floor((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.floor((current / total) * barLength);
  const emptyLength = barLength - filledLength;
  
  const bar = 
    progressChars.full.repeat(filledLength) + 
    progressChars.empty.repeat(emptyLength);
  
  process.stdout.write(
    `\r${colors.cyan}Progress:${colors.reset} [${bar}] ${percentage}% (${current}/${total})`
  );
}

/**
 * Display test result
 */
function displayResult(result, index) {
  const { domain, expected, detected, passed, attackType } = result;
  
  const statusIcon = passed ? '✓' : '✗';
  const statusColor = passed ? colors.green : colors.red;
  const testNumber = `${colors.gray}#${String(index + 1).padStart(3, '0')}${colors.reset}`;
  
  console.log(
    `${testNumber} ${statusColor}${statusIcon}${colors.reset} ` +
    `${colors.bright}${domain.padEnd(40)}${colors.reset} ` +
    `Expected: ${colors.yellow}${expected.padEnd(12)}${colors.reset} ` +
    `Detected: ${statusColor}${detected.padEnd(12)}${colors.reset} ` +
    `${colors.dim}${attackType || 'N/A'}${colors.reset}`
  );
}

/**
 * Display summary statistics
 */
function displaySummary(results) {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  // Count by attack type
  const attackTypes = {};
  results.forEach(r => {
    if (r.attackType) {
      attackTypes[r.attackType] = attackTypes[r.attackType] || { total: 0, passed: 0 };
      attackTypes[r.attackType].total++;
      if (r.passed) attackTypes[r.attackType].passed++;
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bright}${colors.cyan}TEST SUMMARY${colors.reset}`);
  console.log('='.repeat(80));
  console.log(`${colors.bright}Total Tests:${colors.reset}     ${total}`);
  console.log(`${colors.green}Passed:${colors.reset}          ${passed} (${passRate}%)`);
  console.log(`${colors.red}Failed:${colors.reset}          ${failed} (${(100 - passRate).toFixed(1)}%)`);
  
  console.log(`\n${colors.bright}Results by Attack Type:${colors.reset}`);
  console.log('-'.repeat(80));
  
  Object.entries(attackTypes).forEach(([type, stats]) => {
    const typePassRate = ((stats.passed / stats.total) * 100).toFixed(1);
    const color = typePassRate >= 80 ? colors.green : typePassRate >= 60 ? colors.yellow : colors.red;
    console.log(
      `  ${type.padEnd(25)} ${color}${stats.passed}/${stats.total}${colors.reset} (${typePassRate}%)`
    );
  });
  
  console.log('='.repeat(80));
  
  // Overall result
  if (passRate >= 95) {
    console.log(`${colors.green}${colors.bright}✓ EXCELLENT${colors.reset} - Detection system performing very well!`);
  } else if (passRate >= 80) {
    console.log(`${colors.yellow}${colors.bright}⚠ GOOD${colors.reset} - Detection system working but has room for improvement.`);
  } else {
    console.log(`${colors.red}${colors.bright}✗ NEEDS IMPROVEMENT${colors.reset} - Detection system requires attention.`);
  }
  
  console.log('='.repeat(80) + '\n');
}

/**
 * Display failed tests for debugging
 */
function displayFailedTests(results) {
  const failed = results.filter(r => !r.passed);
  
  if (failed.length === 0) {
    return;
  }
  
  console.log(`\n${colors.red}${colors.bright}FAILED TESTS (${failed.length}):${colors.reset}`);
  console.log('-'.repeat(80));
  
  failed.forEach((result, index) => {
    console.log(`\n${colors.bright}${index + 1}. ${result.domain}${colors.reset}`);
    console.log(`   Expected: ${colors.yellow}${result.expected}${colors.reset}`);
    console.log(`   Detected: ${colors.red}${result.detected}${colors.reset}`);
    console.log(`   Attack Type: ${result.attackType || 'N/A'}`);
    console.log(`   Target: ${result.targetInstitution || 'N/A'}`);
    
    if (result.detectionResult) {
      console.log(`   ${colors.dim}Detection Details:${colors.reset}`);
      console.log(`     - Similarity: ${result.detectionResult.similarity?.toFixed(1)}%`);
      console.log(`     - Patterns: ${JSON.stringify(result.detectionResult.patterns)}`);
    }
  });
  
  console.log('-'.repeat(80));
}

/**
 * Main test execution
 */
async function runAllTests() {
  const startTime = Date.now();
  
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bright}${colors.cyan}TYPOSQUATTING DETECTION STRESS TEST${colors.reset}`);
  console.log('='.repeat(80));
  console.log(`${colors.dim}Testing ${testCases.length} domains against detection algorithm...${colors.reset}\n`);
  
  // Load extension code
  console.log(`${colors.cyan}Loading detection algorithm...${colors.reset}`);
  const { legitimateInstitutions, checkForTyposquatting } = loadExtensionCode();
  console.log(`${colors.green}✓${colors.reset} Algorithm loaded successfully\n`);
  
  // Run tests
  console.log(`${colors.cyan}Running tests...${colors.reset}\n`);
  const results = [];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const result = runTest(testCase, checkForTyposquatting, legitimateInstitutions);
    results.push(result);
    
    // Update progress
    displayProgress(i + 1, testCases.length);
  }
  
  const endTime = Date.now();
  
  // Clear progress line and show results
  console.log('\n\n' + '='.repeat(80));
  console.log(`${colors.bright}${colors.cyan}TEST RESULTS${colors.reset}`);
  console.log('='.repeat(80) + '\n');
  
  results.forEach((result, index) => {
    displayResult(result, index);
  });
  
  // Display summary
  displaySummary(results);
  
  // Display failed tests for debugging
  displayFailedTests(results);
  
  // Save log to file
  console.log(`\n${colors.cyan}Saving test log...${colors.reset}`);
  const logContent = createLogContent(results, startTime, endTime);
  const { filename, filepath } = saveLog(logContent);
  console.log(`${colors.green}✓${colors.reset} Log saved: ${colors.dim}${filename}${colors.reset}`);
  console.log(`${colors.dim}  Full path: ${filepath}${colors.reset}\n`);
  
  // Exit with appropriate code
  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}${colors.bright}ERROR:${colors.reset} ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
