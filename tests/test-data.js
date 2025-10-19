// Test Data for Typosquatting Detection Stress Test
// Automatically generated test cases based on institutions.js

/**
 * Test case structure:
 * {
 *   domain: string - The domain to test
 *   expected: 'legitimate' | 'suspicious' | 'unknown'
 *   attackType: string - Type of attack (if suspicious)
 *   targetInstitution: string - Which institution is being spoofed (if suspicious)
 * }
 */

const testCases = [
  // ========================================
  // LEGITIMATE DOMAINS (20% of total)
  // ========================================
  
  // Portuguese Banks
  { domain: "cgd.pt", expected: "legitimate", attackType: null, targetInstitution: "Caixa Geral de Depósitos" },
  { domain: "millenniumbcp.pt", expected: "legitimate", attackType: null, targetInstitution: "Millennium BCP" },
  { domain: "bancobpi.pt", expected: "legitimate", attackType: null, targetInstitution: "Banco BPI" },
  { domain: "novobanco.pt", expected: "legitimate", attackType: null, targetInstitution: "Novo Banco" },
  { domain: "santander.pt", expected: "legitimate", attackType: null, targetInstitution: "Santander" },
  { domain: "activobank.pt", expected: "legitimate", attackType: null, targetInstitution: "ActivoBank" },
  { domain: "moey.pt", expected: "legitimate", attackType: null, targetInstitution: "Moey!" },
  
  // Government
  { domain: "portaldasfinancas.gov.pt", expected: "legitimate", attackType: null, targetInstitution: "Portal das Finanças" },
  { domain: "seg-social.pt", expected: "legitimate", attackType: null, targetInstitution: "Segurança Social" },
  { domain: "sns.gov.pt", expected: "legitimate", attackType: null, targetInstitution: "SNS" },
  
  // Payment & Crypto
  { domain: "paypal.com", expected: "legitimate", attackType: null, targetInstitution: "PayPal" },
  { domain: "mbway.pt", expected: "legitimate", attackType: null, targetInstitution: "MB WAY" },
  { domain: "coinbase.com", expected: "legitimate", attackType: null, targetInstitution: "Coinbase" },
  
  // E-commerce
  { domain: "worten.pt", expected: "legitimate", attackType: null, targetInstitution: "Worten" },
  
  // ========================================
  // SUSPICIOUS DOMAINS (80% of total)
  // ========================================
  
  // --- CHARACTER SUBSTITUTION ATTACKS ---
  { domain: "cqd.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" },
  { domain: "cgd.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" },
  { domain: "millenniumbcp.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpi.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "bancobpi.pt" },
  { domain: "santander.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "santander.pt" },
  { domain: "activobank.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "activobank.pt" },
  { domain: "paypa1.com", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "paypal.com" },
  { domain: "worten.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "worten.pt" },
  
  // --- HOMOGLYPH ATTACKS (Cyrillic/Greek characters) ---
  { domain: "сgd.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "cgd.pt" }, // Cyrillic 'с'
  { domain: "cgd.рt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "cgd.pt" }, // Cyrillic 'р'
  { domain: "millenniumbсp.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "millenniumbcp.pt" }, // Cyrillic 'с'
  { domain: "pаypal.com", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "paypal.com" }, // Cyrillic 'а'
  { domain: "coinbаse.com", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "coinbase.com" }, // Cyrillic 'а'
  
  // --- CHARACTER OMISSION ATTACKS ---
  { domain: "cd.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "cgd.pt" },
  { domain: "millenniumbp.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancopi.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "bancobpi.pt" },
  { domain: "novobaco.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "novobanco.pt" },
  { domain: "activbank.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "activobank.pt" },
  { domain: "paypl.com", expected: "suspicious", attackType: "characterOmission", targetInstitution: "paypal.com" },
  { domain: "mbwy.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "mbway.pt" },
  
  // --- CHARACTER ADDITION ATTACKS ---
  { domain: "cgdd.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "cgd.pt" },
  { domain: "millenniumbcpp.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpii.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "bancobpi.pt" },
  { domain: "santanderr.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "santander.pt" },
  { domain: "activobankk.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "activobank.pt" },
  { domain: "paypall.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "paypal.com" },
  { domain: "mbwayy.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "mbway.pt" },
  { domain: "coinbasee.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "coinbase.com" },
  
  // --- TLD SUBSTITUTION ATTACKS ---
  { domain: "cgd.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "cgd.pt" },
  { domain: "millenniumbcp.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpi.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "bancobpi.pt" },
  { domain: "novobanco.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "novobanco.pt" },
  { domain: "santander.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "santander.pt" },
  { domain: "activobank.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "activobank.pt" },
  { domain: "moey.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "moey.pt" },
  { domain: "mbway.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "mbway.pt" },
  { domain: "worten.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "worten.pt" },
  { domain: "seg-social.com", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "seg-social.pt" },
  { domain: "paypal.pt", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "paypal.com" },
  { domain: "coinbase.pt", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "coinbase.com" },
  
  // --- SUBDOMAIN ABUSE ATTACKS ---
  { domain: "cgd.pt.secure-login.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" },
  { domain: "login.cgd.pt.verify.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" },
  { domain: "millenniumbcp.pt.banking.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "millenniumbcp.pt" },
  { domain: "secure-bancobpi.pt.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "bancobpi.pt" },
  { domain: "paypal.com.verify-account.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "paypal.com" },
  { domain: "mbway.pt.authentication.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "mbway.pt" },
  { domain: "portaldasfinancas.gov.pt.secure.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "portaldasfinancas.gov.pt" },
  
  // --- HYPHENATION ATTACKS ---
  { domain: "c-gd.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "cgd.pt" },
  { domain: "cg-d.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "cgd.pt" },
  { domain: "millennium-bcp.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "millenniumbcp.pt" },
  { domain: "banco-bpi.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "bancobpi.pt" },
  { domain: "novo-banco.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "novobanco.pt" },
  { domain: "pay-pal.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "paypal.com" },
  { domain: "mb-way.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "mbway.pt" },
  
  // --- COMBINED ATTACKS (Multiple techniques) ---
  { domain: "cgdd.com", expected: "suspicious", attackType: "combined", targetInstitution: "cgd.pt" }, // Addition + TLD
  { domain: "millenniumbcpp.com", expected: "suspicious", attackType: "combined", targetInstitution: "millenniumbcp.pt" }, // Addition + TLD
  { domain: "bancopi.com", expected: "suspicious", attackType: "combined", targetInstitution: "bancobpi.pt" }, // Omission + TLD
  { domain: "santanderr.com", expected: "suspicious", attackType: "combined", targetInstitution: "santander.pt" }, // Addition + TLD
  { domain: "paypall.pt", expected: "suspicious", attackType: "combined", targetInstitution: "paypal.com" }, // Addition + TLD
  
  // --- EDGE CASES ---
  { domain: "cgd.pt.phishing.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" },
  { domain: "www-cgd.pt.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" },
  { domain: "secure.cgd.pt.login.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" },
];

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCases };
}

// Export for browser (Chrome extension)
if (typeof window !== 'undefined') {
  window.testCases = testCases;
}
