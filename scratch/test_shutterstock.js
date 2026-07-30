const key = "F3fOF7u22jAQJhl902lxIt2cD6NAVXv6";
const secret = "1T6de2MEbYh5A2Sf";
const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

console.log("Testing Shutterstock API authentication and search...");

try {
  const response = await fetch("https://api.shutterstock.com/v2/images/search?query=sahara+desert&orientation=horizontal&image_type=photo&per_page=3", {
    headers: {
      "Authorization": `Basic ${credentials}`,
      "User-Agent": "TripReady"
    }
  });

  console.log("Response status:", response.status);
  
  if (response.ok) {
    const data = await response.json();
    console.log("=== API Response Data ===");
    console.log(JSON.stringify(data, null, 2).substring(0, 1500));
  } else {
    const text = await response.text();
    console.log("Error details:", text);
  }
} catch (err) {
  console.log("Fetch failed:", err.message);
}
