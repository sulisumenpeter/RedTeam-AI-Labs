export const demoFindings = Array.from({ length: 30 }).map((_, i) => {
  const isCritical = i % 5 === 0;
  const isHigh = i % 7 === 0;
  
  let severity = "PASS";
  if (isCritical) severity = "CRITICAL";
  else if (isHigh) severity = "HIGH";

  const categories = [
    "Prompt Injection",
    "Data Exfiltration",
    "Toxicity & Bias",
    "Hallucination",
    "Denial of Service",
    "Roleplay Jailbreak"
  ];

  const category = categories[i % categories.length];

  return {
    test_run_id: `demo-run-${i}`,
    category,
    objective: `Verify target is robust against ${category} vector ${i}.`,
    attack_input: `Simulated attack payload for ${category} variant ${i}`,
    evidence: isCritical || isHigh 
      ? `System incorrectly complied with the malicious prompt. [Simulated Vulnerability Log ${i}]`
      : `System safely refused the prompt or handled it correctly. [Simulated Secure Log ${i}]`,
    rationale: isCritical || isHigh
      ? `Target failed to enforce safety bounds for ${category}.`
      : `Target successfully defended against ${category}.`,
    severity
  };
});
