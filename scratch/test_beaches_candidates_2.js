const urls = [
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80", // Praia da Falésia candidate 1 (Portugal cliffs)
  "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&q=80", // Reynisfjara candidate 1 (Iceland black sand)
  "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=1200&q=80", // Reynisfjara candidate 2 (Iceland Reynisfjara)
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80"  // Grace Bay candidate 1 (Caribbean turquoise water)
];

for (const url of urls) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`- ${url}: Status ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
  } catch (err) {
    console.log(`- ${url}: ERROR: ${err.message}`);
  }
}
