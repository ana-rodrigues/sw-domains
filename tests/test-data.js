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
  { domain: "cqd.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" }, // g→q
  { domain: "ccd.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" }, // g→c
  { domain: "millenniumbop.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "millenniumbcp.pt" }, // c→o
  { domain: "bancobpl.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "bancobpi.pt" }, // i→l
  { domain: "santamder.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "santander.pt" }, // n→m
  { domain: "activobenk.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "activobank.pt" }, // a→e
  { domain: "paypa1.com", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "paypal.com" }, // l→1
  { domain: "wortem.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "worten.pt" }, // n→m
  
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
  
  // ========================================
  // ADDITIONAL TEST CASES (Doubling database)
  // ========================================
  
  // --- MORE LEGITIMATE DOMAINS ---
  { domain: "creditoagricola.pt", expected: "legitimate", attackType: null, targetInstitution: "Crédito Agrícola" },
  { domain: "montepio.pt", expected: "legitimate", attackType: null, targetInstitution: "Montepio" },
  { domain: "bankinter.pt", expected: "legitimate", attackType: null, targetInstitution: "Bankinter" },
  { domain: "binance.com", expected: "legitimate", attackType: null, targetInstitution: "Binance" },
  { domain: "kraken.com", expected: "legitimate", attackType: null, targetInstitution: "Kraken" },
  { domain: "revolut.com", expected: "legitimate", attackType: null, targetInstitution: "Revolut" },
  { domain: "n26.com", expected: "legitimate", attackType: null, targetInstitution: "N26" },
  
  // --- LEGITIMATE SUBDOMAINS (Testing subdomain detection fix) ---
  { domain: "particulares.santander.pt", expected: "legitimate", attackType: null, targetInstitution: "Santander" },
  { domain: "empresas.santander.pt", expected: "legitimate", attackType: null, targetInstitution: "Santander" },
  { domain: "login.cgd.pt", expected: "legitimate", attackType: null, targetInstitution: "CGD" },
  { domain: "secure.millenniumbcp.pt", expected: "legitimate", attackType: null, targetInstitution: "Millennium BCP" },
  { domain: "online.bancobpi.pt", expected: "legitimate", attackType: null, targetInstitution: "Banco BPI" },
  { domain: "www.paypal.com", expected: "legitimate", attackType: null, targetInstitution: "PayPal" },
  { domain: "accounts.google.com", expected: "legitimate", attackType: null, targetInstitution: "Google" },
  
  // --- MORE CHARACTER SUBSTITUTION ATTACKS ---
  { domain: "cgd.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" }, // c→c (visually similar)
  { domain: "cfd.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" }, // g→f
  { domain: "novobancо.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "novobanco.pt" }, // o→о (Cyrillic)
  { domain: "santander.рt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "santander.pt" }, // p→р (Cyrillic)
  { domain: "moey.рt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "moey.pt" }, // p→р (Cyrillic)
  { domain: "paypa1.соm", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "paypal.com" }, // l→1, o→о
  { domain: "coinbaze.com", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "coinbase.com" }, // s→z
  { domain: "binanse.com", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "binance.com" }, // c→s
  
  // --- MORE HOMOGLYPH ATTACKS ---
  { domain: "сgd.рt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "cgd.pt" }, // Both Cyrillic
  { domain: "millenniumbсp.рt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "millenniumbcp.pt" }, // с and р Cyrillic
  { domain: "bаncobpi.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "bancobpi.pt" }, // Cyrillic 'а'
  { domain: "sаntander.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "santander.pt" }, // Cyrillic 'а'
  { domain: "аctivobank.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "activobank.pt" }, // Cyrillic 'а'
  { domain: "mоey.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "moey.pt" }, // Cyrillic 'о'
  { domain: "mbwаy.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "mbway.pt" }, // Cyrillic 'а'
  { domain: "wоrten.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "worten.pt" }, // Cyrillic 'о'
  
  // --- MORE CHARACTER OMISSION ATTACKS ---
  { domain: "millenniumcp.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "millenniumbcp.pt" },
  { domain: "millenniumbp.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "millenniumbcp.pt" },
  { domain: "novobano.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "novobanco.pt" },
  { domain: "santaner.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "santander.pt" },
  { domain: "activobnk.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "activobank.pt" },
  { domain: "coinbse.com", expected: "suspicious", attackType: "characterOmission", targetInstitution: "coinbase.com" },
  { domain: "binace.com", expected: "suspicious", attackType: "characterOmission", targetInstitution: "binance.com" },
  
  // --- MORE CHARACTER ADDITION ATTACKS ---
  { domain: "cggd.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "cgd.pt" },
  { domain: "millenniummbcp.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobppi.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "bancobpi.pt" },
  { domain: "novobancco.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "novobanco.pt" },
  { domain: "santanderr.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "santander.pt" },
  { domain: "moeey.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "moey.pt" },
  { domain: "worrten.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "worten.pt" },
  { domain: "coinbasee.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "coinbase.com" },
  
  // --- MORE TLD SUBSTITUTION ATTACKS ---
  { domain: "cgd.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "cgd.pt" },
  { domain: "cgd.org", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "cgd.pt" },
  { domain: "millenniumbcp.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpi.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "bancobpi.pt" },
  { domain: "novobanco.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "novobanco.pt" },
  { domain: "moey.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "moey.pt" },
  { domain: "mbway.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "mbway.pt" },
  { domain: "paypal.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "paypal.com" },
  { domain: "coinbase.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "coinbase.com" },
  { domain: "binance.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "binance.com" },
  
  // --- MORE SUBDOMAIN ABUSE ATTACKS ---
  { domain: "millenniumbcp.pt.secure.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpi.pt.login.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "bancobpi.pt" },
  { domain: "novobanco.pt.verify.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "novobanco.pt" },
  { domain: "santander.pt.secure-login.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "santander.pt" },
  { domain: "activobank.pt.banking.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "activobank.pt" },
  { domain: "moey.pt.secure.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "moey.pt" },
  { domain: "coinbase.com.verify.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "coinbase.com" },
  { domain: "binance.com.login.org", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "binance.com" },
  { domain: "auth.cgd.pt.secure.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" },
  { domain: "verify.paypal.com.account.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "paypal.com" },
  
  // --- MORE HYPHENATION ATTACKS ---
  { domain: "cg-dd.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "cgd.pt" },
  { domain: "millennium-bcpp.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "millenniumbcp.pt" },
  { domain: "banco-bpii.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "bancobpi.pt" },
  { domain: "novo-bancoo.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "novobanco.pt" },
  { domain: "santand-er.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "santander.pt" },
  { domain: "activo-bank.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "activobank.pt" },
  { domain: "pay-pall.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "paypal.com" },
  
  // --- MORE COMBINED ATTACKS ---
  { domain: "cqd.com", expected: "suspicious", attackType: "combined", targetInstitution: "cgd.pt" }, // Substitution + TLD
  { domain: "millenniumbop.com", expected: "suspicious", attackType: "combined", targetInstitution: "millenniumbcp.pt" }, // Substitution + TLD
  { domain: "bancobpl.com", expected: "suspicious", attackType: "combined", targetInstitution: "bancobpi.pt" }, // Substitution + TLD
  { domain: "novobaco.com", expected: "suspicious", attackType: "combined", targetInstitution: "novobanco.pt" }, // Omission + TLD
  { domain: "santamder.com", expected: "suspicious", attackType: "combined", targetInstitution: "santander.pt" }, // Substitution + TLD
  { domain: "activbank.com", expected: "suspicious", attackType: "combined", targetInstitution: "activobank.pt" }, // Omission + TLD
  { domain: "moeey.com", expected: "suspicious", attackType: "combined", targetInstitution: "moey.pt" }, // Addition + TLD
  { domain: "mbwayy.com", expected: "suspicious", attackType: "combined", targetInstitution: "mbway.pt" }, // Addition + TLD
  { domain: "paypa1.net", expected: "suspicious", attackType: "combined", targetInstitution: "paypal.com" }, // Substitution + TLD
  { domain: "coinbaze.net", expected: "suspicious", attackType: "combined", targetInstitution: "coinbase.com" }, // Substitution + TLD
  
  // --- ADVANCED EDGE CASES ---
  { domain: "cgd.pt.account-verify.secure-login.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" }, // Multiple subdomains
  { domain: "secure-cgd.pt.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" }, // Hyphen prefix
  { domain: "cgd-pt.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" }, // Dot to hyphen
  { domain: "www-millenniumbcp.pt.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "millenniumbcp.pt" },
  { domain: "login-bancobpi.pt.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "bancobpi.pt" },
  { domain: "my-paypal.com.verify.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "paypal.com" },
  
  // ========================================
  // THIRD EXPANSION - More Attack Variations
  // ========================================
  
  // --- MORE LEGITIMATE DOMAINS & SUBDOMAINS ---
  { domain: "wise.com", expected: "legitimate", attackType: null, targetInstitution: "Wise" },
  { domain: "stripe.com", expected: "legitimate", attackType: null, targetInstitution: "Stripe" },
  { domain: "square.com", expected: "legitimate", attackType: null, targetInstitution: "Square" },
  { domain: "auth.cgd.pt", expected: "legitimate", attackType: null, targetInstitution: "CGD" },
  { domain: "mobile.millenniumbcp.pt", expected: "legitimate", attackType: null, targetInstitution: "Millennium BCP" },
  { domain: "business.paypal.com", expected: "legitimate", attackType: null, targetInstitution: "PayPal" },
  { domain: "pro.coinbase.com", expected: "legitimate", attackType: null, targetInstitution: "Coinbase" },
  { domain: "app.revolut.com", expected: "legitimate", attackType: null, targetInstitution: "Revolut" },
  
  // --- ADDITIONAL CHARACTER SUBSTITUTION ---
  { domain: "cgd.рt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" }, // Cyrillic р in TLD
  { domain: "сgd.рt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "cgd.pt" }, // Double Cyrillic
  { domain: "cg0.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "cgd.pt" }, // d→0
  { domain: "millenniumbcp.рt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "millenniumbcp.pt" }, // Cyrillic р
  { domain: "bancobp1.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "bancobpi.pt" }, // i→1
  { domain: "santand3r.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "santander.pt" }, // e→3
  { domain: "m0ey.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "moey.pt" }, // o→0
  { domain: "mbvvay.pt", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "mbway.pt" }, // w→vv
  { domain: "paypa1.c0m", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "paypal.com" }, // l→1, o→0
  { domain: "c0inbase.com", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "coinbase.com" }, // o→0
  { domain: "binance.c0m", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "binance.com" }, // o→0
  { domain: "rev0lut.com", expected: "suspicious", attackType: "characterSubstitution", targetInstitution: "revolut.com" }, // o→0
  
  // --- ADDITIONAL HOMOGLYPH ATTACKS ---
  { domain: "nоvobanco.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "novobanco.pt" }, // Cyrillic о
  { domain: "mоey.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "moey.pt" }, // Cyrillic о
  { domain: "wоrten.pt", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "worten.pt" }, // Cyrillic о
  { domain: "binаnce.com", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "binance.com" }, // Cyrillic а
  { domain: "krаken.com", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "kraken.com" }, // Cyrillic а
  { domain: "revоlut.com", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "revolut.com" }, // Cyrillic о
  { domain: "n2б.com", expected: "suspicious", attackType: "homoglyphAttack", targetInstitution: "n26.com" }, // Cyrillic б
  
  // --- ADDITIONAL CHARACTER OMISSION ---
  { domain: "cg.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "cgd.pt" },
  { domain: "millenniumcp.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobp.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "bancobpi.pt" },
  { domain: "novobano.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "novobanco.pt" },
  { domain: "santaner.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "santander.pt" },
  { domain: "activobnk.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "activobank.pt" },
  { domain: "mey.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "moey.pt" },
  { domain: "mbay.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "mbway.pt" },
  { domain: "worte.pt", expected: "suspicious", attackType: "characterOmission", targetInstitution: "worten.pt" },
  { domain: "paypa.com", expected: "suspicious", attackType: "characterOmission", targetInstitution: "paypal.com" },
  { domain: "coinbse.com", expected: "suspicious", attackType: "characterOmission", targetInstitution: "coinbase.com" },
  { domain: "binace.com", expected: "suspicious", attackType: "characterOmission", targetInstitution: "binance.com" },
  
  // --- ADDITIONAL CHARACTER ADDITION ---
  { domain: "ccgd.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "cgd.pt" },
  { domain: "millenniummbc.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpii.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "bancobpi.pt" },
  { domain: "novobancco.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "novobanco.pt" },
  { domain: "ssantander.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "santander.pt" },
  { domain: "activobankk.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "activobank.pt" },
  { domain: "moeey.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "moey.pt" },
  { domain: "mbwway.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "mbway.pt" },
  { domain: "wortenn.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "worten.pt" },
  { domain: "paypall.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "paypal.com" },
  { domain: "coinbasee.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "coinbase.com" },
  { domain: "binancee.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "binance.com" },
  
  // --- ADDITIONAL TLD SUBSTITUTION ---
  { domain: "cgd.eu", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "cgd.pt" },
  { domain: "cgd.info", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "cgd.pt" },
  { domain: "millenniumbcp.eu", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpi.org", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "bancobpi.pt" },
  { domain: "novobanco.eu", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "novobanco.pt" },
  { domain: "santander.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "santander.pt" },
  { domain: "activobank.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "activobank.pt" },
  { domain: "moey.org", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "moey.pt" },
  { domain: "mbway.org", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "mbway.pt" },
  { domain: "worten.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "worten.pt" },
  { domain: "paypal.org", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "paypal.com" },
  { domain: "coinbase.org", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "coinbase.com" },
  { domain: "binance.org", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "binance.com" },
  { domain: "revolut.net", expected: "suspicious", attackType: "tldSubstitution", targetInstitution: "revolut.com" },
  
  // --- ADDITIONAL SUBDOMAIN ABUSE ---
  { domain: "cgd.pt.verify-account.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" },
  { domain: "millenniumbcp.pt.login-secure.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "millenniumbcp.pt" },
  { domain: "bancobpi.pt.authentication.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "bancobpi.pt" },
  { domain: "novobanco.pt.secure-access.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "novobanco.pt" },
  { domain: "santander.pt.online-banking.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "santander.pt" },
  { domain: "activobank.pt.client-area.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "activobank.pt" },
  { domain: "moey.pt.app-login.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "moey.pt" },
  { domain: "mbway.pt.payment-verify.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "mbway.pt" },
  { domain: "paypal.com.account-security.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "paypal.com" },
  { domain: "coinbase.com.wallet-verify.org", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "coinbase.com" },
  { domain: "binance.com.trading-secure.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "binance.com" },
  { domain: "revolut.com.card-activation.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "revolut.com" },
  
  // --- ADDITIONAL HYPHENATION ATTACKS ---
  { domain: "c-g-d.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "cgd.pt" },
  { domain: "millennium-bcp-pt.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "millenniumbcp.pt" },
  { domain: "banco-bpi-online.pt", expected: "suspicious", attackType: "characterAddition", targetInstitution: "bancobpi.pt" },
  { domain: "novo-banco-pt.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "novobanco.pt" },
  { domain: "santander-pt.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "santander.pt" },
  { domain: "activo-bank-pt.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "activobank.pt" },
  { domain: "pay-pal-secure.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "paypal.com" },
  { domain: "coin-base.com", expected: "suspicious", attackType: "characterAddition", targetInstitution: "coinbase.com" },
  
  // --- MORE COMBINED ATTACKS ---
  { domain: "cgdd.net", expected: "suspicious", attackType: "combined", targetInstitution: "cgd.pt" }, // Addition + TLD
  { domain: "millenniumbcpp.org", expected: "suspicious", attackType: "combined", targetInstitution: "millenniumbcp.pt" }, // Addition + TLD
  { domain: "bancopi.net", expected: "suspicious", attackType: "combined", targetInstitution: "bancobpi.pt" }, // Omission + TLD
  { domain: "novobaco.net", expected: "suspicious", attackType: "combined", targetInstitution: "novobanco.pt" }, // Omission + TLD
  { domain: "santanderr.org", expected: "suspicious", attackType: "combined", targetInstitution: "santander.pt" }, // Addition + TLD
  { domain: "activbank.net", expected: "suspicious", attackType: "combined", targetInstitution: "activobank.pt" }, // Omission + TLD
  { domain: "moeey.net", expected: "suspicious", attackType: "combined", targetInstitution: "moey.pt" }, // Addition + TLD
  { domain: "mbwayy.org", expected: "suspicious", attackType: "combined", targetInstitution: "mbway.pt" }, // Addition + TLD
  { domain: "wortem.com", expected: "suspicious", attackType: "combined", targetInstitution: "worten.pt" }, // Substitution + TLD
  { domain: "paypa1.org", expected: "suspicious", attackType: "combined", targetInstitution: "paypal.com" }, // Substitution + TLD
  { domain: "coinbaze.org", expected: "suspicious", attackType: "combined", targetInstitution: "coinbase.com" }, // Substitution + TLD
  { domain: "binanse.net", expected: "suspicious", attackType: "combined", targetInstitution: "binance.com" }, // Substitution + TLD
  { domain: "rev0lut.net", expected: "suspicious", attackType: "combined", targetInstitution: "revolut.com" }, // Substitution + TLD
  
  // --- EXTREME EDGE CASES ---
  { domain: "cgd.pt.secure.login.verify.account.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" }, // Deep nesting
  { domain: "www-secure-cgd-pt.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" }, // Multiple hyphens
  { domain: "cgd.pt.com.br", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "cgd.pt" }, // Country code TLD
  { domain: "auth-millenniumbcp.pt.secure.com", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "millenniumbcp.pt" },
  { domain: "secure.login.bancobpi.pt.verify.net", expected: "suspicious", attackType: "subdomainAbuse", targetInstitution: "bancobpi.pt" },
];

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCases };
}

// Export for browser (Chrome extension)
if (typeof window !== 'undefined') {
  window.testCases = testCases;
}
