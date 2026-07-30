const candidates = [
  // Annapurna candidates
  { name: "Annapurna - ABC Trek", url: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80" },
  { name: "Annapurna - Nepal peak", url: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=1200&q=80" },
  { name: "Annapurna - Mountain range", url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80" },
  { name: "Annapurna - Nepal ABC", url: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?w=1200&q=80" },
  { name: "Annapurna - Nepal peak 2", url: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&q=80" },

  // Dolomites candidates
  { name: "Dolomites - Braies Lake", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80" },
  { name: "Dolomites - Seceda Ridge", url: "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1?w=1200&q=80" },
  { name: "Dolomites - Tre Cime", url: "https://images.unsplash.com/photo-1518098268026-4e43a1a009de?w=1200&q=80" },
  { name: "Dolomites - Alps peak", url: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=1200&q=80" },

  // Aconcagua candidates
  { name: "Aconcagua - Andes range Fitz Roy", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80" },
  { name: "Aconcagua - Snowy peak", url: "https://images.unsplash.com/photo-1582298538104-fc76a055dbf7?w=1200&q=80" },
  { name: "Aconcagua - Andes peak", url: "https://images.unsplash.com/photo-1563810188984-7f8b2248e680?w=1200&q=80" }
];

console.log("Testing candidate image URLs...");

for (const cand of candidates) {
  try {
    const res = await fetch(cand.url, { method: 'HEAD' });
    console.log(`- ${cand.name}: Status ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
  } catch (err) {
    console.log(`- ${cand.name}: ERROR: ${err.message}`);
  }
}
