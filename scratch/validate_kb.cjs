const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'attractionKnowledgeBase.js'), 'utf8');

// Strip both exports and eval
let code = file.replace('export const attractionKnowledgeBase =', 'var attractionKnowledgeBase =');
code = code.replace('export const realCityFoodAndTransit =', 'var realCityFoodAndTransit =');
eval(code);

const keys = Object.keys(attractionKnowledgeBase);
console.log(`Total city keys in attractionKnowledgeBase: ${keys.length}`);

const transitKeys = Object.keys(realCityFoodAndTransit);
console.log(`Total city keys in realCityFoodAndTransit: ${transitKeys.length}`);

let errors = [];
for (const key of keys) {
  const val = attractionKnowledgeBase[key];
  if (Array.isArray(val)) {
    if (val.length < 10) {
      errors.push(`${key}: only ${val.length} attractions (expected >=10)`);
    }
    for (let i = 0; i < val.length; i++) {
      const a = val[i];
      if (!a.id) errors.push(`${key}[${i}]: missing id`);
      if (!a.name) errors.push(`${key}[${i}]: missing name`);
      if (!a.image) errors.push(`${key}[${i}]: missing image`);
      if (!a.reviews || a.reviews.length === 0) errors.push(`${key}[${i}]: missing reviews`);
      if (!a.rating) errors.push(`${key}[${i}]: missing rating`);
    }
    console.log(`  ${key}: ${val.length} attractions ✓`);
  } else {
    errors.push(`${key}: unexpected type ${typeof val}, expected array`);
  }
}

if (errors.length > 0) {
  console.log('\n=== ERRORS ===');
  errors.forEach(e => console.log('  ❌ ' + e));
} else {
  console.log('\n✅ All cities validated successfully!');
}
