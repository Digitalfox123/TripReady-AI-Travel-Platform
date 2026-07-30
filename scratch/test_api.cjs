const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

async function testPexels() {
  const query = "Grand Palace Bangkok landmark";
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=2`;
  try {
    const res = await fetch(url, { headers: { "Authorization": PEXELS_KEY } });
    console.log('Pexels Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Pexels Photos count:', data.photos ? data.photos.length : 0);
      if (data.photos && data.photos.length > 0) {
        console.log('Pexels Sample URL:', data.photos[0].src.large2x);
      }
    }
  } catch (e) {
    console.error('Pexels Error:', e.message);
  }
}

async function testPixabay() {
  const query = "Grand Palace Bangkok";
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=2`;
  try {
    const res = await fetch(url);
    console.log('Pixabay Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Pixabay Hits count:', data.hits ? data.hits.length : 0);
      if (data.hits && data.hits.length > 0) {
        console.log('Pixabay Sample URL:', data.hits[0].largeImageURL);
      }
    }
  } catch (e) {
    console.error('Pixabay Error:', e.message);
  }
}

async function run() {
  await testPexels();
  await testPixabay();
}

run();
