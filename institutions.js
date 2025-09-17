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

  // Critical Utilities (Billing fraud targets)
  "edp.pt": { 
    name: "EDP", 
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
  }
};

// Export for use in content script
// Note: Chrome extensions don't support ES6 modules, so we'll access this globally
window.legitimateInstitutions = legitimateInstitutions;