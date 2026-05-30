export const CUSTOM_KNOWLEDGE_BASE = [
  {
    keywords: ["leo wong", "leo", "wong"],
    info: "Leo Wong is the APEC Lead at Access Protocol. He focuses on expanding the protocol's reach across the Asia-Pacific region, driving strategic partnerships, and promoting 'invisible onboarding' for Web3."
  },
  {
    keywords: ["mikael", "mikael anderson", "ceo", "founder"],
    info: "Mikael Anderson is the founder and CEO of Access Protocol, focused on revolutionizing the creator economy by replacing recurring fiat subscriptions with a unified Web3 staking model."
  },
  {
    keywords: ["accio", "accio ai", "who are you", "what are you"],
    info: "Accio is an AI dashboard built for the Access Protocol ecosystem. It helps users discover creators, check pool stats, design shareable creator cards, and understand staking. Powered by Xiaomi MiMo."
  }
];

export function searchKnowledgeBase(text) {
  const normalizedText = text.toLowerCase();
  const matchedInfo = [];

  for (const entry of CUSTOM_KNOWLEDGE_BASE) {
    // Check if any keyword is present in the text
    const isMatch = entry.keywords.some((kw) => {
      // Use word boundaries if possible, but simple includes is fine for now
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(normalizedText);
    });

    if (isMatch) {
      matchedInfo.push(`- ${entry.info}`);
    }
  }

  return matchedInfo;
}
