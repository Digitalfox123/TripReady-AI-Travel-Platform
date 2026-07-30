const { attractionKnowledgeBase } = require('../src/data/attractionKnowledgeBase.js');

console.log('=== Potential Truncations / Suspicious Names ===');
for (const citySlug in attractionKnowledgeBase) {
  if (citySlug === 'lahore' || citySlug === 'stlouis') continue;
  const attractions = attractionKnowledgeBase[citySlug];
  attractions.forEach((spot, idx) => {
    const name = spot.name;
    const words = name.split(/\s+/);
    const lastWord = words[words.length - 1].replace(/[^\w]/g, '');
    
    // Check if name is very short, or ends with common truncated particles/incomplete words,
    // or has unbalanced parentheses.
    const hasUnbalancedParens = (name.split('(').length !== name.split(')').length);
    const isVeryShort = name.length <= 8;
    const endsWithSuspicious = ['al', 'de', 'la', 'le', 'un', 'et', 'an', 'i', 'vieux', 'sacre', 'champs', 'notre', 'jean', 'senso', 'kinkaku', 'kiyomizu', 'ryoan', 'shitenno'].includes(lastWord.toLowerCase());
    
    if (hasUnbalancedParens || isVeryShort || endsWithSuspicious) {
      console.log(`City: ${citySlug} -> Spot ${idx + 1}: "${name}"`);
    }
  });
}
