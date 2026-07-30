const testNames = [
  "Warner Bros. World Abu Dhabi",
  "Ben Thanh Market",
  "Chichen Itza",
  "Louvre Abu Dhabi",
  "Notre-Dame Cathedral",
  "Sensō-ji Temple",
  "Kinkaku-ji (Golden Pavilion)",
  "Al-Masjid al-Haram",
  "Al-Masjid an-Nabawi",
  "Eiffel Tower",
  "Colosseum"
];

async function run() {
  console.log('=== Testing Wikipedia REST API ===');
  for (const name of testNames) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const img = data.originalimage ? data.originalimage.source : (data.thumbnail ? data.thumbnail.source : null);
        console.log(`Name: "${name}" -> Image: ${img}`);
      } else {
        console.log(`Name: "${name}" -> Status: ${res.status}`);
      }
    } catch (e) {
      console.log(`Name: "${name}" -> Error: ${e.message}`);
    }
  }
}

run();
