const urls = [
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80",
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1200&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80",
  "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=1200&q=80", // Fuji candidate 2
  "https://images.unsplash.com/photo-1533038590840-1cde6b66b72d?w=1200&q=80" // Denali candidate 2
];

for (const url of urls) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`- ${url}: Status ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
  } catch (err) {
    console.log(`- ${url}: ERROR: ${err.message}`);
  }
}
