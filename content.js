function cleanDomain(hostname) {
    return hostname.replace(/^www\./, '');
  }
  
  const rawDomain = window.location.hostname;
  const currentDomain = cleanDomain(rawDomain);
  
  console.log("Raw domain:", rawDomain);
  console.log("Cleaned domain:", currentDomain);
  
  // Check if it's a legitimate bank
  if (legitimateBanks.hasOwnProperty(currentDomain)) {
    console.log("✅ O domínio deste website é reconhecido como legítimo.", legitimateBanks[currentDomain].name);
  } else {
    console.log("ℹ️ Risco de fraude: o domínio deste website não é reconhecido como legítimo. Não forneça quaisquer detalhes de identificação pessoal ou informação sensível se não tem certeza que o website é seguro.", currentDomain);
    
    // Check for typosquatting
    const result = checkForTyposquatting(currentDomain);
    if (result.suspicious) {
      const message = `
        ⚠️ Risco de fraude: ℹ️ Risco de fraude: apesar das semelhanças, este domínio não é o website oficial do ${result.bankName}. Não forneça quaisquer detalhes de identificação pessoal ou informação sensível se não tem certeza que o website é seguro.
      `;
      createWarningBanner(message);
    }
  }