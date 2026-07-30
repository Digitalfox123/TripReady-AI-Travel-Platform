async function testTranslation() {
  const query = "Bonjour tout le monde! Comment ça va?";
  const targetLang = "en";
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Response Data:", JSON.stringify(data, null, 2));
    const translatedText = data[0].map(s => s[0]).join('');
    const detectedLangCode = data[2];
    console.log("Translated:", translatedText);
    console.log("Detected Lang Code:", detectedLangCode);
  } catch (error) {
    console.error("Error fetching translation:", error);
  }
}

testTranslation();
