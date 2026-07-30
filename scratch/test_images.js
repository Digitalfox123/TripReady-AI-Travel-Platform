const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

async function fetchFromPexels(query) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5`;
    const response = await fetch(url, {
      headers: { "Authorization": PEXELS_KEY }
    });
    if (response.ok) {
      const data = await response.json();
      return data.photos ? data.photos.map(p => p.src.large2x || p.src.large) : [];
    }
  } catch (err) {
    console.error("Pexels fetch failed:", err);
  }
  return [];
}

async function fetchFromPixabay(query) {
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=5&min_width=1200`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.hits ? data.hits.map(h => h.largeImageURL || h.webformatURL) : [];
    }
  } catch (err) {
    console.error("Pixabay fetch failed:", err);
  }
  return [];
}

async function run() {
  const query = "Mohenjo-daro Pakistan";
  console.log(`Searching Pexels for "${query}"...`);
  const pex = await fetchFromPexels(query);
  console.log("Pexels results:", pex);

  console.log(`Searching Pixabay for "${query}"...`);
  const pix = await fetchFromPixabay(query);
  console.log("Pixabay results:", pix);
}

run();
