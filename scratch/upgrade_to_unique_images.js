import fs from 'fs';
import path from 'path';

const PROJECT_DIR = 'C:\\Users\\hafiz\\.gemini\\antigravity\\scratch\\trip-ready';
const DATA_FILE = path.join(PROJECT_DIR, 'src/data/index.js');

let content = fs.readFileSync(DATA_FILE, 'utf8');

// Define replacements mapping destination ID or unique context to a new unique high-res Unsplash photo.
// We will replace the image fields for specific destinations that had duplicates.
const replacements = [
  { id: 'phuket', oldImage: "image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1528181304800-2f5353a98ef3?w=1200&q=80'" },
  { id: 'dubai-desert', oldImage: "image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?w=1200&q=80'" },
  { id: 'patagonia-steppes', oldImage: "image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80'" },
  { id: 'andes-trail', oldImage: "image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80'" },
  { id: 'mount-fuji', oldImage: "image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80'" },
  { id: 'tromso', oldImage: "image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1483168527879-c66136b56105?w=1200&q=80'" },
  
  // Swiss Alps duplicates
  { id: 'himalayas-summit', oldImage: "image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80'" },
  { id: 'rocky-mountains', oldImage: "image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80'" },
  { id: 'dolomites', oldImage: "image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80'" },
  { id: 'kilimanjaro', oldImage: "image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a5550?w=1200&q=80'" },
  { id: 'yellowstone', oldImage: "image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80'" },
  
  // Amazon/Madagascar wild duplicate & Madagascar double-check
  { id: 'madagascar', oldImage: "image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?w=1200&q=80'" },
  { id: 'madagascar', oldImage: "image: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80'" },
  
  // Angkor Wat duplicate
  { id: 'angkor-wat', oldImage: "image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80'" },
  
  // Hunza/Queenstown duplicate
  { id: 'queenstown', oldImage: "image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80'" },
  
  // Cancun Beach duplicates
  { id: 'athens', oldImage: "image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1603566673472-297b4047043b?w=1200&q=80'" },
  { id: 'bora-bora', oldImage: "image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1532408840957-031d8034aeef?w=1200&q=80'" },
  { id: 'galapagos', oldImage: "image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=1200&q=80'" },
  { id: 'havana', oldImage: "image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80'" },
  
  // Serengeti/Kruger safari duplicate
  { id: 'kruger', oldImage: "image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80'", newImage: "image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=1200&q=80'" }
];

replacements.forEach(r => {
  // We locate the block containing the destination ID, and then replace its image
  // To avoid replacing in other blocks, we target a block regex
  const blockRegex = new RegExp(`(id:\\s*'${r.id}'[\\s\\S]*?)${escapeRegex(r.oldImage)}`, 'g');
  if (content.match(blockRegex)) {
    content = content.replace(blockRegex, `$1${r.newImage}`);
    console.log(`Successfully replaced image for destination ID: ${r.id}`);
  } else {
    console.log(`Warning: Could not match block for destination ID: ${r.id}`);
  }
});

fs.writeFileSync(DATA_FILE, content, 'utf8');
console.log("Completed unique image upgrades inside src/data/index.js.");

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
