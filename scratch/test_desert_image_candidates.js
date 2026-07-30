const candidates = [
  // Arctic / Snow / Polar
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
  'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1200&q=80',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80',
  'https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?w=1200&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
  'https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=1200&q=80',

  // Sahara Desert alternatives
  'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?w=1200&q=80', // We know this one failed
  'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1440631276082-96570c9eb38c?w=1200&q=80', // Sahara dunes
  'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=1200&q=80', // Camel in desert
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80', // Space view

  // Thar Desert alternatives
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1455620611406-966ca6889d80?w=1200&q=80', // Jaisalmer
  'https://images.unsplash.com/photo-1542397284385-601017642687?w=1200&q=80', // Thar desert
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80', // Indian fort

  // Namib Desert alternatives
  'https://images.unsplash.com/photo-1505342930777-628d0b25e1df?w=1200&q=80', // We know this one failed
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1602652674900-515c6130ba27?w=1200&q=80', // Sossusvlei dunes
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80', // Deadvlei
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80', // Namibia road

  // Great Victoria alternatives
  'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80', // Worked
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'  // Travel maps
];

console.log(`Testing ${candidates.length} candidates...`);
for (let i = 0; i < candidates.length; i++) {
  const url = candidates[i];
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`Candidate [${i + 1}/${candidates.length}]: Status ${res.status} ${res.ok ? 'OK' : 'FAIL'} for ${url}`);
  } catch (err) {
    console.log(`Candidate [${i + 1}/${candidates.length}]: ERROR ${err.message} for ${url}`);
  }
}
