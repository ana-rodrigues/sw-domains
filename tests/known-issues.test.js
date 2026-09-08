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

function loadDetector() {
  global.window = {};

  const institutionsCode = fs.readFileSync(path.join(__dirname, '..', 'institutions.js'), 'utf8');
  eval(institutionsCode);
  global.legitimateInstitutions = global.window.legitimateInstitutions;

  const detectorCode = fs.readFileSync(path.join(__dirname, '..', 'typosquatting-detector.js'), 'utf8');
  eval(detectorCode);

  return {
    legitimateInstitutions: global.window.legitimateInstitutions,
    checkForTyposquatting: global.window.checkForTyposquatting,
    detectTyposquattingPatterns: global.window.detectTyposquattingPatterns,
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

describe('SIDE-24: no public-suffix awareness in multi-label TLDs', () => {
  test('dropping a mid-label (gov) from a multi-part legitimate domain is not flagged', () => {
    // "justica.gov.pt" -> "justica.pt" drops the "gov" label. tldSubstitution
    // requires domainParts.length === legitParts.length, and the length delta
    // here doesn't match the -1 required by characterOmission, so this
    // currently produces zero flagged patterns despite being an obvious
    // impersonation of a government domain.
    const patterns = detectTyposquattingPatterns('justica.pt', 'justica.gov.pt');
    assert.ok(
      !Object.values(patterns).some(Boolean),
      'expected no pattern to fire for a dropped mid-label — this is the SIDE-24 gap'
    );

    const result = checkForTyposquatting('justica.pt');
    assert.equal(result.suspicious, false, 'known false negative — flip to true once SIDE-24 lands PSL-based parsing');
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
