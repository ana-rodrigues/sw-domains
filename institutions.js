// Portuguese Institutions Database
// Focused database of the most critical Portuguese institutions for fraud prevention

const legitimateInstitutions = {

  // Major Banks (Primary targets for fraud)
  "cgd.pt": { 
    name: "Caixa Geral de Depósitos", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "millenniumbcp.pt": { 
    name: "Millennium BCP", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "bancobpi.pt": { 
    name: "Banco BPI", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "novobanco.pt": { 
    name: "Novo Banco", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "santander.pt": { 
    name: "Santander", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "creditoagricola.pt": { 
    name: "Crédito Agrícola", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "bancomontepio.pt": { 
    name: "Banco Montepio", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "bancobest.pt": { 
    name: "Banco Best", 
    type: "bank", 
    country: "PT", 
    verified: true 
  },
  "activobank.pt": {
    name: "ActivoBank",
    type: "bank",
    country: "PT",
    verified: true
  },
  "bankinter.pt": {
    name: "Bankinter",
    type: "bank",
    country: "PT",
    verified: true
  },
  "bigonline.pt": {
    name: "BiG",
    type: "bank",
    country: "PT",
    verified: true
  },
  "moey.pt": {
    name: "Moey!",
    type: "bank",
    country: "PT",
    verified: true
  },
  "n26.com": {
    name: "N26",
    type: "bank",
    country: "GLOBAL",
    verified: true
  },
  "revolut.com": {
    name: "Revolut",
    type: "bank",
    country: "GLOBAL",
    verified: true
  },
  "wise.com": {
    name: "Wise",
    type: "bank",
    country: "GLOBAL",
    verified: true
  },
  "bancocarregosa.com": {
    name: "Banco Carregosa",
    type: "bank",
    country: "PT",
    verified: true
  },

  // Government Services (High-value targets)
  "portaldasfinancas.gov.pt": { 
    name: "Portal das Finanças", 
    type: "government", 
    country: "PT", 
    verified: true 
  },
  "seg-social.pt": { 
    name: "Segurança Social", 
    type: "government", 
    country: "PT", 
    verified: true 
  },
  "portaldocidadao.pt": { 
    name: "Portal do Cidadão", 
    type: "government", 
    country: "PT", 
    verified: true 
  },
  "portugal.gov.pt": { 
    name: "Portal do Governo", 
    type: "government", 
    country: "PT", 
    verified: true 
  },
  "imi-online.pt": {
    name: "IMI Online",
    type: "government",
    country: "PT",
    verified: true
  },
  "sns.gov.pt": {
    name: "Serviço Nacional de Saúde",
    type: "government",
    country: "PT",
    verified: true
  },
  "iefp.pt": {
    name: "Instituto do Emprego e Formação Profissional",
    type: "government",
    country: "PT",
    verified: true
  },
  "justica.gov.pt": {
    name: "Ministério da Justiça",
    type: "government",
    country: "PT",
    verified: true
  },
  "ama.gov.pt": {
    name: "Agência para a Modernização Administrativa",
    type: "government",
    country: "PT",
    verified: true
  },
  "irn.mj.pt": {
    name: "Instituto dos Registos e do Notariado",
    type: "government",
    country: "PT",
    verified: true
  },

  // Financial Services & Payment Systems
  "paypal.com": { 
    name: "PayPal", 
    type: "financial", 
    country: "GLOBAL", 
    verified: true 
  },
  "mbway.pt": { 
    name: "MB WAY", 
    type: "payment", 
    country: "PT", 
    verified: true 
  },
  "stripe.com": {
    name: "Stripe",
    type: "payment",
    country: "GLOBAL",
    verified: true
  },
  "coinbase.com": {
    name: "Coinbase",
    type: "crypto",
    country: "GLOBAL",
    verified: true
  },
  "binance.com": {
    name: "Binance",
    type: "crypto",
    country: "GLOBAL",
    verified: true
  },
  "kraken.com": {
    name: "Kraken",
    type: "crypto",
    country: "GLOBAL",
    verified: true
  },

  // Major Insurance (Often targeted)
  "tranquilidade.pt": { 
    name: "Tranquilidade", 
    type: "insurance", 
    country: "PT", 
    verified: true 
  },
  "generali.pt": { 
    name: "Generali", 
    type: "insurance", 
    country: "PT", 
    verified: true 
  },
  "fidelidade.pt": {
    name: "Fidelidade",
    type: "insurance",
    country: "PT",
    verified: true
  },
  "liberty-seguros.pt": {
    name: "Liberty Seguros",
    type: "insurance",
    country: "PT",
    verified: true
  },
  "allianz.pt": {
    name: "Allianz",
    type: "insurance",
    country: "PT",
    verified: true
  },

  // Critical Utilities (Billing fraud targets)
  "edp.pt": { 
    name: "EDP", 
    type: "utility", 
    country: "PT", 
    verified: true 
  },
  "galp.pt": {
    name: "Galp",
    type: "utility",
    country: "PT",
    verified: true
  },
  "aguaslisboa.pt": {
    name: "EPAL - Águas de Lisboa",
    type: "utility",
    country: "PT",
    verified: true
  },

  // Major Telecom (Account takeover targets)
  "meo.pt": { 
    name: "MEO", 
    type: "telecom", 
    country: "PT", 
    verified: true 
  },
  "nos.pt": { 
    name: "NOS", 
    type: "telecom", 
    country: "PT", 
    verified: true 
  },
  "vodafone.pt": { 
    name: "Vodafone", 
    type: "telecom", 
    country: "PT", 
    verified: true 
  },
  "nowo.pt": {
    name: "NOWO",
    type: "telecom",
    country: "PT",
    verified: true
  },
  "uzo.pt": {
    name: "UZO",
    type: "telecom",
    country: "PT",
    verified: true
  },

  // E-commerce & Retail (Phishing targets)
  "worten.pt": {
    name: "Worten",
    type: "ecommerce",
    country: "PT",
    verified: true
  },
  "fnac.pt": {
    name: "FNAC",
    type: "ecommerce",
    country: "PT",
    verified: true
  },
  "continente.pt": {
    name: "Continente",
    type: "ecommerce",
    country: "PT",
    verified: true
  },
  "auchan.pt": {
    name: "Auchan",
    type: "ecommerce",
    country: "PT",
    verified: true
  },
  "pingo-doce.pt": {
    name: "Pingo Doce",
    type: "ecommerce",
    country: "PT",
    verified: true
  },
  "mediamarkt.pt": {
    name: "MediaMarkt",
    type: "ecommerce",
    country: "PT",
    verified: true
  },
  "amazon.es": {
    name: "Amazon Spain",
    type: "ecommerce",
    country: "ES",
    verified: true
  },
  "amazon.com": {
    name: "Amazon",
    type: "ecommerce",
    country: "GLOBAL",
    verified: true
  },

  // Email & Cloud Services (Account takeover targets)
  "sapo.pt": {
    name: "SAPO Mail",
    type: "email",
    country: "PT",
    verified: true
  },
  "gmail.com": {
    name: "Gmail",
    type: "email",
    country: "GLOBAL",
    verified: true
  },
  "outlook.com": {
    name: "Outlook",
    type: "email",
    country: "GLOBAL",
    verified: true
  },
  "hotmail.com": {
    name: "Hotmail",
    type: "email",
    country: "GLOBAL",
    verified: true
  },
  "yahoo.com": {
    name: "Yahoo Mail",
    type: "email",
    country: "GLOBAL",
    verified: true
  },

  // Social Media & Tech (Common phishing targets)
  "facebook.com": {
    name: "Facebook",
    type: "social",
    country: "GLOBAL",
    verified: true
  },
  "instagram.com": {
    name: "Instagram",
    type: "social",
    country: "GLOBAL",
    verified: true
  },
  "linkedin.com": {
    name: "LinkedIn",
    type: "social",
    country: "GLOBAL",
    verified: true
  },
  "twitter.com": {
    name: "Twitter",
    type: "social",
    country: "GLOBAL",
    verified: true
  },
  "x.com": {
    name: "X (Twitter)",
    type: "social",
    country: "GLOBAL",
    verified: true
  },
  "microsoft.com": {
    name: "Microsoft",
    type: "tech",
    country: "GLOBAL",
    verified: true
  },
  "apple.com": {
    name: "Apple",
    type: "tech",
    country: "GLOBAL",
    verified: true
  },
  "netflix.com": {
    name: "Netflix",
    type: "streaming",
    country: "GLOBAL",
    verified: true
  },
  "spotify.com": {
    name: "Spotify",
    type: "streaming",
    country: "GLOBAL",
    verified: true
  },
  
  // Additional banks for stress testing
  "creditoagricola.pt": {
    name: "Crédito Agrícola",
    type: "bank",
    country: "PT",
    verified: true
  },
  "montepio.pt": {
    name: "Montepio",
    type: "bank",
    country: "PT",
    verified: true
  },
  "bankinter.pt": {
    name: "Bankinter",
    type: "bank",
    country: "PT",
    verified: true
  },
  
  // Additional crypto platforms for stress testing
  "binance.com": {
    name: "Binance",
    type: "crypto",
    country: "GLOBAL",
    verified: true
  },
  "kraken.com": {
    name: "Kraken",
    type: "crypto",
    country: "US",
    verified: true
  },
  
  // Additional fintech for stress testing
  "revolut.com": {
    name: "Revolut",
    type: "fintech",
    country: "UK",
    verified: true
  },
  "n26.com": {
    name: "N26",
    type: "fintech",
    country: "DE",
    verified: true
  },
  
  // Additional tech companies for testing
  "google.com": {
    name: "Google",
    type: "tech",
    country: "GLOBAL",
    verified: true
  },
  
  // Additional payment & fintech for stress testing
  "wise.com": {
    name: "Wise",
    type: "fintech",
    country: "UK",
    verified: true
  },
  "stripe.com": {
    name: "Stripe",
    type: "payment",
    country: "US",
    verified: true
  },
  "square.com": {
    name: "Square",
    type: "payment",
    country: "US",
    verified: true
  },
  "kraken.com": {
    name: "Kraken",
    type: "crypto",
    country: "US",
    verified: true
  }
};

// Export for use in content script
// Note: Chrome extensions don't support ES6 modules, so we'll access this globally
window.legitimateInstitutions = legitimateInstitutions;