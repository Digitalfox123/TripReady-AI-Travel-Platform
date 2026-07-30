const desertImages = [
  // 1. Antarctic Desert
  'https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=1200&q=80',
  'https://images.unsplash.com/photo-1489674261899-78b97d34a414?w=1200&q=80',
  'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1200&q=80',
  'https://images.unsplash.com/photo-1524820197278-540916411e20?w=1200&q=80',

  // 2. Arctic Desert
  'https://images.unsplash.com/photo-1520637102912-2df6bb2aac6d?w=1200&q=80',
  'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=1200&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
  'https://images.unsplash.com/photo-1489440543286-a69330151c0b?w=1200&q=80',

  // 3. Sahara Desert
  'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?w=1200&q=80',
  'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80',
  'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200&q=80',
  'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80',

  // 4. Arabian Desert
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80',
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80',

  // 5. Thar Desert
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
  'https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=1200&q=80',
  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80',

  // 6. Kalahari Desert
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  'https://images.unsplash.com/photo-1528184039930-bd03972bd974?w=1200&q=80',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&q=80',

  // 7. Great Victoria Desert
  'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=1200&q=80',
  'https://images.unsplash.com/photo-1494233636054-4378f60acc65?w=1200&q=80',
  'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80',
  'https://images.unsplash.com/photo-1518098268026-4e43a1a009de?w=1200&q=80',

  // 8. Atacama Desert
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&q=80',
  'https://images.unsplash.com/photo-1483168527879-c66136b56105?w=1200&q=80',
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=80',

  // 9. Namib Desert
  'https://images.unsplash.com/photo-1505342930777-628d0b25e1df?w=1200&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80',

  // 10. Gobi Desert
  'https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=1200&q=80',
  'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1200&q=80',

  // 11. Kyzylkum & Karakum
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80'
];

console.log(`Checking ${desertImages.length} image URLs...`);
let allOk = true;

for (let i = 0; i < desertImages.length; i++) {
  const url = desertImages[i];
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`[${i + 1}/${desertImages.length}] Status ${res.status} ${res.ok ? 'OK' : 'FAIL'} for ${url.substring(0, 65)}...`);
    if (!res.ok) {
      allOk = false;
    }
  } catch (err) {
    console.log(`[${i + 1}/${desertImages.length}] ERROR: ${err.message} for ${url}`);
    allOk = false;
  }
}

console.log("----------------------------------------");
console.log(allOk ? "SUCCESS: All desert images are 100% active and working!" : "FAILURE: Some images are broken.");
