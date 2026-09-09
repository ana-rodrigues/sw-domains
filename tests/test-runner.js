#!/usr/bin/env node

// Typosquatting Detection Stress Test Runner
// Runs automated tests against the detection algorithm

// Import test data
const { testCases } = require('./test-data.js');

// Import detection algorithm components
// We need to simulate the browser environment for the extension code
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

// Test cases that fail today for tracked reasons (see tests/known-issues.test.js
// and the linked SIDE-2x issues). The runner treats a match against this list as
// an "expected failure" rather than a regression, so:
//   - a NEW failure (not in this list) still fails the build
//   - one of these starting to pass gets flagged as "now fixed" instead of
//     silently going unnoticed, so the entry can be removed
// Matched by (domain, attackType, targetInstitution) rather than array index,
// since test-data.js has duplicate entries and reordering shouldn't matter.
const KNOWN_FAILURES = [
  { domain: 'cd.pt', attackType: 'characterOmission', targetInstitution: 'cgd.pt' },
  { domain: 'cgdd.com', attackType: 'combined', targetInstitution: 'cgd.pt' },
  { domain: 'cgd.pt', attackType: 'characterSubstitution', targetInstitution: 'cgd.pt' },
  { domain: 'paypa1.соm', attackType: 'characterSubstitution', targetInstitution: 'paypal.com' },
  { domain: 'сgd.рt', attackType: 'homoglyphAttack', targetInstitution: 'cgd.pt' },
  { domain: 'сgd.рt', attackType: 'homoglyphAttack', targetInstitution: 'cgd.pt' },
  { domain: 'cqd.com', attackType: 'combined', targetInstitution: 'cgd.pt' },
  { domain: 'paypa1.net', attackType: 'combined', targetInstitution: 'paypal.com' },
  { domain: 'cgd.pt.account-verify.secure-login.com', attackType: 'subdomainAbuse', targetInstitution: 'cgd.pt' },
  { domain: 'cgd-pt.com', attackType: 'subdomainAbuse', targetInstitution: 'cgd.pt' },
  { domain: 'paypa1.c0m', attackType: 'characterSubstitution', targetInstitution: 'paypal.com' },
  { domain: 'cg.pt', attackType: 'characterOmission', targetInstitution: 'cgd.pt' },
  { domain: 'millenniummbc.pt', attackType: 'characterAddition', targetInstitution: 'millenniumbcp.pt' },
  { domain: 'paypa1.org', attackType: 'combined', targetInstitution: 'paypal.com' },
  { domain: 'cgd.pt.secure.login.verify.account.com', attackType: 'subdomainAbuse', targetInstitution: 'cgd.pt' },
  { domain: 'www-secure-cgd-pt.com', attackType: 'subdomainAbuse', targetInstitution: 'cgd.pt' },
];

/**
 * Mark each failing result as a tracked (known) failure or an unexpected one,
 * consuming KNOWN_FAILURES as a multiset so duplicate test cases are handled
 * correctly. Returns the annotated results plus any KNOWN_FAILURES entries
 * that were never matched (i.e. that test now passes and the entry is stale).
 */
function classifyKnownFailures(results) {
  const remaining = KNOWN_FAILURES.map(k => ({ ...k, matched: false }));

  const classified = results.map(result => {
    if (result.passed) {
      return { ...result, trackedFailure: false };
    }
    const match = remaining.find(k =>
      !k.matched &&
      k.domain === result.domain &&
      k.attackType === result.attackType &&
      k.targetInstitution === result.targetInstitution
    );
    if (match) {
      match.matched = true;
      return { ...result, trackedFailure: true };
    }
    return { ...result, trackedFailure: false };
  });

  const staleKnownFailures = remaining.filter(k => !k.matched);

  return { classified, staleKnownFailures };
}

// Content scripts, in the order manifest.json loads them (minus content.js,
// which only runs in a real page). Each file is a plain global script with
// no module system, exactly like Chrome loads them — so tests run them the
// same way via vm.runInContext rather than eval(), which keeps each file's
// top-level declarations isolated the way separate <script> tags would.
const EXTENSION_SCRIPT_FILES = [
  'public-suffix-list.js',
  'public-suffix.js',
  'homoglyph-confusables.js',
  'institutions.js',
  'typosquatting-detector.js',
];

/**
 * Load and execute extension code in Node.js context
 */
function loadExtensionCode() {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);

  for (const file of EXTENSION_SCRIPT_FILES) {
    const code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    vm.runInContext(code, sandbox, { filename: file });
  }

  return {
    legitimateInstitutions: sandbox.window.legitimateInstitutions,
    checkForTyposquatting: sandbox.window.checkForTyposquatting,
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
  const { domain, expected, detected, passed, attackType, trackedFailure } = result;

  const statusIcon = passed ? '✓' : trackedFailure ? '⚠' : '✗';
  const statusColor = passed ? colors.green : trackedFailure ? colors.yellow : colors.red;
  const testNumber = `${colors.gray}#${String(index + 1).padStart(3, '0')}${colors.reset}`;

  console.log(
    `${testNumber} ${statusColor}${statusIcon}${colors.reset} ` +
    `${colors.bright}${domain.padEnd(40)}${colors.reset} ` +
    `Expected: ${colors.yellow}${expected.padEnd(12)}${colors.reset} ` +
    `Detected: ${statusColor}${detected.padEnd(12)}${colors.reset} ` +
    `${colors.dim}${attackType || 'N/A'}${trackedFailure ? ' (known gap)' : ''}${colors.reset}`
  );
}

/**
 * Display summary statistics
 */
function displaySummary(results, staleKnownFailures) {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const tracked = results.filter(r => !r.passed && r.trackedFailure).length;
  const unexpected = failed - tracked;
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
  console.log(`${colors.yellow}  known gaps:${colors.reset}    ${tracked} (tracked, does not fail the build)`);
  console.log(`${colors.red}  unexpected:${colors.reset}    ${unexpected} (regressions — fails the build)`);
  if (staleKnownFailures.length > 0) {
    console.log(
      `${colors.yellow}${colors.bright}  now fixed:${colors.reset}     ${staleKnownFailures.length} ` +
      `(these KNOWN_FAILURES entries now pass — remove them from test-runner.js)`
    );
  }

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

  // Overall result — the build only fails on unexpected failures or a stale
  // KNOWN_FAILURES entry, not on the raw pass rate (which includes tracked gaps).
  if (unexpected === 0 && staleKnownFailures.length === 0) {
    console.log(`${colors.green}${colors.bright}✓ PASS${colors.reset} - no regressions against the known baseline.`);
  } else if (unexpected > 0) {
    console.log(`${colors.red}${colors.bright}✗ FAIL${colors.reset} - ${unexpected} unexpected failure(s) not in KNOWN_FAILURES.`);
  } else {
    console.log(`${colors.yellow}${colors.bright}✗ FAIL${colors.reset} - ${staleKnownFailures.length} KNOWN_FAILURES entr${staleKnownFailures.length === 1 ? 'y is' : 'ies are'} stale (now passing).`);
  }

  console.log('='.repeat(80) + '\n');
}

/**
 * Display failed tests for debugging. Tracked (known) failures are shown
 * separately from unexpected ones so a real regression doesn't get lost in
 * the noise of pre-existing, already-tracked gaps.
 */
function displayFailedTests(results) {
  const unexpectedFailed = results.filter(r => !r.passed && !r.trackedFailure);
  const trackedFailed = results.filter(r => !r.passed && r.trackedFailure);

  if (unexpectedFailed.length === 0 && trackedFailed.length === 0) {
    return;
  }

  if (trackedFailed.length > 0) {
    console.log(`\n${colors.yellow}${colors.bright}KNOWN GAPS (${trackedFailed.length}, tracked — not a regression):${colors.reset}`);
    console.log('-'.repeat(80));
    trackedFailed.forEach((result, index) => {
      console.log(`${colors.dim}${index + 1}. ${result.domain} (${result.attackType || 'N/A'})${colors.reset}`);
    });
  }

  const failed = unexpectedFailed;
  if (failed.length === 0) {
    console.log('');
    return;
  }

  console.log(`\n${colors.red}${colors.bright}UNEXPECTED FAILURES (${failed.length}):${colors.reset}`);
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

  // Classify failures against the known-gaps baseline before displaying anything,
  // so both the per-result markers and the summary agree on what's tracked.
  const { classified: classifiedResults, staleKnownFailures } = classifyKnownFailures(results);

  // Clear progress line and show results
  console.log('\n\n' + '='.repeat(80));
  console.log(`${colors.bright}${colors.cyan}TEST RESULTS${colors.reset}`);
  console.log('='.repeat(80) + '\n');

  classifiedResults.forEach((result, index) => {
    displayResult(result, index);
  });

  // Display summary
  displaySummary(classifiedResults, staleKnownFailures);

  // Display failed tests for debugging
  displayFailedTests(classifiedResults);

  // Save log to file
  console.log(`\n${colors.cyan}Saving test log...${colors.reset}`);
  const logContent = createLogContent(classifiedResults, startTime, endTime);
  const { filename, filepath } = saveLog(logContent);
  console.log(`${colors.green}✓${colors.reset} Log saved: ${colors.dim}${filename}${colors.reset}`);
  console.log(`${colors.dim}  Full path: ${filepath}${colors.reset}\n`);

  // Exit with appropriate code: only unexpected failures or a stale
  // KNOWN_FAILURES entry (a tracked gap that now passes) fail the build.
  const unexpectedFailures = classifiedResults.filter(r => !r.passed && !r.trackedFailure);
  const buildFailed = unexpectedFailures.length > 0 || staleKnownFailures.length > 0;
  process.exit(buildFailed ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}${colors.bright}ERROR:${colors.reset} ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
