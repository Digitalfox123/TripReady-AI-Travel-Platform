import fs from 'fs';

let content = fs.readFileSync('src/data/index.js', 'utf8');

// List of replacements
const replacements = [
  // Everest Gallery
  {
    target: `"https://images.unsplash.com/photo-1500313830540-7b66a0a71fd6?w=1200&q=80"`,
    replacement: `"https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80"`
  },
  {
    target: `"https://images.unsplash.com/photo-1522083165195-342750297f05?w=1200&q=80"`,
    replacement: `"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80"`
  },
  // Dolomites
  {
    target: `"https://images.unsplash.com/photo-1533587837373-373-f63cb32c5fd9?w=1200&q=80"`,
    replacement: `"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80"`
  },
  // Aconcagua
  {
    target: `"https://images.unsplash.com/photo-1563810188984-7f8b2248e680?w=1200&q=80"`,
    replacement: `"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"`
  },
  // Denali Gallery[3]
  {
    target: `"https://images.unsplash.com/photo-1533038590840-1cde6b66b72d?w=1200&q=80"`,
    replacement: `"https://images.unsplash.com/photo-1531315630201-bb15abeb1653?w=1200&q=80"`
  },
  // Fuji Gallery[3]
  {
    target: `"https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=1200&q=80"`,
    replacement: `"https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80"`
  }
];

// Let's do replacements step-by-step
replacements.forEach(r => {
  if (content.includes(r.target)) {
    // Replace all occurrences
    content = content.replaceAll(r.target, r.replacement);
    console.log(`Replaced all occurrences of ${r.target.substring(0, 40)}...`);
  } else {
    console.log(`Warning: Target ${r.target.substring(0, 40)}... not found!`);
  }
});

// Wait, let's also double-check the Annapurna massif specific images since we replaced photo-1500313830540-7b66a0a71fd6 globally with photo-1454496522488-7a8e488e8606 (Everest snowy peaks).
// But for Annapurna, we want it to be photo-1605640840605-14ac1855827b (ABC Trek / Machapuchare).
// So let's replace Annapurna Massif's specific image and gallery[0] which would now be photo-1454496522488-7a8e488e8606.
// Let's target the exact lines or context of Annapurna!
// Let's view the Annapurna section in the code after replacing to check.
// Actually, let's do this: we will write the file, then read it, find the annapurna-massif object, and update its image and first gallery item to be the ABC Trek image!

fs.writeFileSync('src/data/index.js', content, 'utf8');
console.log("Successfully wrote updated src/data/index.js");
