import fs from 'fs';

let content = fs.readFileSync('src/data/index.js', 'utf8');

// Find the annapurna-massif block
// The block has:
// "id": "annapurna-massif",
// "name": "Annapurna Massif",
// "country": "Nepal",
// "flag": "NP",
// "rank": 48,
// "image": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",

const targetSegment = `"id": "annapurna-massif",\n    "name": "Annapurna Massif",\n    "country": "Nepal",\n    "flag": "NP",\n    "rank": 48,\n    "image": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80"`;
const replacementSegment = `"id": "annapurna-massif",\n    "name": "Annapurna Massif",\n    "country": "Nepal",\n    "flag": "NP",\n    "rank": 48,\n    "image": "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80"`;

if (content.includes(targetSegment)) {
  content = content.replace(targetSegment, replacementSegment);
  console.log("Replaced Annapurna Massif primary image.");
} else {
  // Let's do a more robust replace if spacing differs
  console.log("Warning: Exact Annapurna primary image segment not found! Let's check without spacing.");
  const targetSegmentClean = targetSegment.replace(/\s+/g, ' ');
  console.log("Target clean:", targetSegmentClean);
}

// Now replace Annapurna's gallery[0] which is currently "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80"
// Let's find the gallery of annapurna:
// "categoryIds": [
//   "mountains",
//   "snow",
//   "adventure"
// ],
// "gallery": [
//   "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",

const targetGallerySegment = `"gallery": [\n      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80"`;
const replacementGallerySegment = `"gallery": [\n      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80"`;

// Wait, let's make sure we only replace this inside the Annapurna Massif block, not globally (since Everest also has that in gallery)!
// So let's find the Annapurna Massif block boundary.
const startIndex = content.indexOf('"id": "annapurna-massif"');
const endIndex = content.indexOf('},\n  {\n    "id": "mont-blanc"');

if (startIndex !== -1 && endIndex !== -1) {
  let annapurnaBlock = content.substring(startIndex, endIndex);
  
  // Replace primary image
  annapurnaBlock = annapurnaBlock.replace(
    `"image": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80"`,
    `"image": "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80"`
  );
  
  // Replace gallery[0]
  annapurnaBlock = annapurnaBlock.replace(
    `"https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80"`,
    `"https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80"`
  );
  
  content = content.substring(0, startIndex) + annapurnaBlock + content.substring(endIndex);
  console.log("Successfully updated Annapurna Massif primary and gallery images inside its block!");
} else {
  console.log("ERROR: Could not find Annapurna Massif block range!");
}

fs.writeFileSync('src/data/index.js', content, 'utf8');
