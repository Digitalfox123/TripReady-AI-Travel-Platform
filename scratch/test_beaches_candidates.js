const candidates = [
  { name: "Entalula (Palawan)", id: "photo-1516690561799-46d8f74f9abf" },
  { name: "Whitehaven (Swirling)", id: "photo-1506929562872-bb421503ef21" },
  { name: "Bioluminescent Maldives", id: "photo-1507525428034-b723cf961d3e" },
  { name: "Railay (Krabi)", id: "photo-1552465011-b4e21bf6e79a" },
  { name: "Elafonissi (Crete)", id: "photo-1505118380757-91f5f5632de0" },
  { name: "Praia da Falésia (Algarve)", id: "photo-1520116468812-95b2bb1aa54a" },
  { name: "La Pelosa (Sardinia)", id: "photo-1533105079780-92b9be482077" },
  { name: "Reynisfjara (Black Sand)", id: "photo-1504893524553-ac55fce69cbf" },
  { name: "Isla Pasión (Cozumel)", id: "photo-1544735716-392fe2489ffa" },
  { name: "Grace Bay (Turks)", id: "photo-1506953823976-52e1fdc0135a" },
  { name: "La Jolla Cove (San Diego)", id: "photo-1473448912268-2022ce9509d8" },
  { name: "Tulum (Mayan Ruins)", id: "photo-1537996194471-e657df975ab4" },
  { name: "Boulders Beach (Penguins)", id: "photo-1488646953014-85cb44e25828" },
  { name: "Saadiyat (Abu Dhabi)", id: "photo-1516426122078-c23e76319801" },
  { name: "Camps Bay (Cape Town)", id: "photo-1580618672591-eb180b1a973f" }
];

console.log("Testing specific beach image IDs on Unsplash...");

for (const cand of candidates) {
  const url = `https://images.unsplash.com/${cand.id}?w=1200&q=80`;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`- ${cand.name} (${cand.id}): Status ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
  } catch (err) {
    console.log(`- ${cand.name}: ERROR: ${err.message}`);
  }
}
