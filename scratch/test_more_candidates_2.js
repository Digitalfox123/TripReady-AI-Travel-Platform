const urls = [
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80",
  "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=80",
  "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200&q=80",
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&q=80",
  "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?w=1200&q=80",
  "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=1200&q=80"
];

for (const url of urls) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`- ${url}: Status ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
  } catch (err) {
    console.log(`- ${url}: ERROR: ${err.message}`);
  }
}
