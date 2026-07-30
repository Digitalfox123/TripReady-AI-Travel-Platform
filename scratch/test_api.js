const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

async function testWikipedia(title) {
  try {
    const pageTitle = title.trim().replace(/\s+/g, '_');
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log('Wikipedia Success:', data.originalimage?.source);
      return;
    }
    console.log('Wikipedia Status:', response.status);
  } catch (err) {
    console.error('Wikipedia Error:', err.message);
  }
}

async function testPexels(query) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`;
    const response = await fetch(url, {
      headers: { "Authorization": PEXELS_KEY }
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Pexels Success:', data.photos?.[0]?.src?.large);
      return;
    }
    console.log('Pexels Status:', response.status);
  } catch (err) {
    console.error('Pexels Error:', err.message);
  }
}

async function testPixabay(query) {
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3&min_width=1200`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log('Pixabay Success:', data.hits?.[0]?.largeImageURL);
      return;
    }
    console.log('Pixabay Status:', response.status);
  } catch (err) {
    console.error('Pixabay Error:', err.message);
  }
}

async function run() {
  console.log('Testing APIs...');
  await testWikipedia('Beijing');
  await testPexels('Beijing landmark');
  await testPixabay('Beijing landmark');
}

run();
