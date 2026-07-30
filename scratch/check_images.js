import fs from 'fs';
import path from 'path';

const publicDir = 'C:\\Users\\hafiz\\.gemini\\antigravity\\scratch\\trip-ready\\public';
const files = ['earth_globe_transparent.png', 'volumetric_clouds_transparent.png'];

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`File: ${file}, Size: ${stats.size} bytes, Status: EXISTS`);
  } else {
    console.log(`File: ${file}, Status: MISSING`);
  }
});
