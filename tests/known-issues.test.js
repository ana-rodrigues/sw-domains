// Regression tests pinning down specific detection gaps found in the
// improvement-opportunities review (tracked in Linear as SIDE-22..28,
// project "Mira Safe Web Improvements").
//
// These exist so automated changes to institutions.js / typosquatting-detector.js
// (including ones made by an agent) can be checked against known-bad behavior:
// most assertions here describe the CURRENT (buggy) output. When a linked issue
// is fixed, its test's assertion should be flipped to the correct expectation.
//
// Run with: node --test tests/known-issues.test.js

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Content scripts, in the order manifest.json loads them (minus content.js,
// which only runs in a real page) — see tests/test-runner.js for the same list.
const EXTENSION_SCRIPT_FILES = [
  'public-suffix-list.js',
  'public-suffix.js',
  'homoglyph-confusables.js',
  'institutions.js',
  'typosquatting-detector.js',
];

function loadDetector() {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);

  for (const file of EXTENSION_SCRIPT_FILES) {
    const code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    vm.runInContext(code, sandbox, { filename: file });
  }

  return {
    legitimateInstitutions: sandbox.window.legitimateInstitutions,
    checkForTyposquatting: sandbox.window.checkForTyposquatting,
    detectTyposquattingPatterns: sandbox.window.detectTyposquattingPatterns,
  };
}

const { checkForTyposquatting, detectTyposquattingPatterns } = loadDetector();

describe('SIDE-22: duplicate keys in institutions.js', () => {
  test('every institution domain is declared exactly once', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'institutions.js'), 'utf8');
    const keyPattern = /^\s*"([^"]+)":\s*\{/gm;
    const keys = [...source.matchAll(keyPattern)].map(m => m[1]);

    const counts = {};
    for (const key of keys) counts[key] = (counts[key] || 0) + 1;
    const duplicates = Object.entries(counts).filter(([, n]) => n > 1).map(([k]) => k);

    assert.deepEqual(duplicates, [], 'institutions.js has duplicate keys again');
  });
});

describe('SIDE-24: PSL-based suffix parsing for multi-label TLDs', () => {
  test('dropping a mid-label (gov) from a multi-part legitimate domain is flagged as tldSubstitution', () => {
    // "justica.gov.pt" -> "justica.pt" drops the "gov" label. Per the real
    // PSL, "gov.pt" and "pt" are both registered public suffixes, so
    // PSL-based parsing (public-suffix.js) correctly reads this as a suffix
    // substitution ("gov.pt" -> "pt") with an identical name ("justica"),
    // the same way "cgd.pt" -> "cgd.com" is.
    const patterns = detectTyposquattingPatterns('justica.pt', 'justica.gov.pt');
    assert.equal(patterns.tldSubstitution, true);

    const result = checkForTyposquatting('justica.pt');
    assert.equal(result.suspicious, true);
  });
});

describe('SIDE-25: label-boundary-aware embedding check (not raw substring)', () => {
  test('a legitimate domain appearing only as a suffix of an unrelated label is not flagged', () => {
    // "notcgd.pt.example.com" contains the literal substring "cgd.pt", but
    // "cgd" there is a suffix of the unrelated label "notcgd", not a label of
    // its own — domain.includes(legitimateDomain) used to misfire on this.
    const patterns = detectTyposquattingPatterns('notcgd.pt.example.com', 'cgd.pt');
    assert.equal(patterns.subdomainAbuse, false);

    const result = checkForTyposquatting('notcgd.pt.example.com');
    assert.equal(result.suspicious, false);
  });

  test('a legitimate domain embedded as real labels is still flagged as subdomain abuse', () => {
    const patterns = detectTyposquattingPatterns('cgd.pt.evil.com', 'cgd.pt');
    assert.equal(patterns.subdomainAbuse, true);
  });
});

describe('SIDE-26: confusables-table-based homoglyph detection', () => {
  test('a Cyrillic look-alike for a letter outside the old 16-letter map is detected', () => {
    // Cyrillic 'г' (U+0433) renders as Latin 'r', which was never covered by
    // the old hand-rolled HOMOGLYPH_MAP (only a/c/e/i/o/p/s/d/g/h/n/t/u/v/x/y
    // had entries), so "kraken.com" spoofed via its 'r' used to slip through.
    const patterns = detectTyposquattingPatterns('kгaken.com', 'kraken.com');
    assert.equal(patterns.homoglyphAttack, true);

    const result = checkForTyposquatting('kгaken.com');
    assert.equal(result.suspicious, true);
  });
});

describe('SIDE-27: combined multi-character edits within the same length', () => {
  test('two simultaneous substitutions are not detected as characterSubstitution', () => {
    // "cqx.pt" vs "cgd.pt": g->q and d->x, same length (6). characterSubstitution
    // only fires when exactly one character differs, so a 2-character edit at
    // the same length is invisible to every pattern check.
    const patterns = detectTyposquattingPatterns('cqx.pt', 'cgd.pt');
    assert.equal(patterns.characterSubstitution, false);
    assert.ok(
      !Object.values(patterns).some(Boolean),
      'expected no pattern to fire for a same-length 2-char edit — this is the SIDE-27 gap'
    );

    const result = checkForTyposquatting('cqx.pt');
    assert.equal(result.suspicious, false, 'known false negative — flip to true once SIDE-27 adds edit-distance-based matching');
  });
});

describe('SIDE-28: binary fraud risk level', () => {
  test('every suspicious match is labeled "fraud" regardless of confidence', () => {
    // A borderline character-substitution case: similarity is well above threshold
    // but far from certain, yet riskLevel collapses to a single 'fraud' bucket.
    const result = checkForTyposquatting('cqd.pt'); // g->q substitution of cgd.pt
    assert.equal(result.suspicious, true);
    assert.equal(result.riskLevel, 'fraud', 'known limitation — replace with a graduated level once SIDE-28 lands');
  });
});
