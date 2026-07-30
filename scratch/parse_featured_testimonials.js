import fs from 'fs';

const text = fs.readFileSync('scratch/testimonials_match_4.txt', 'utf8');
const lines = text.split('\n');
console.log("Lines 1180 to 1240 of index.js viewed in step 4:");

// Since the lines in step_index have line numbers like "1205: ...", let's parse and print them
lines.forEach(l => {
  if (l.includes('featuredTestimonials') || l.includes('1205:') || l.includes('1206:') || l.includes('1207:') || l.includes('1208:') || l.includes('1209:') || l.includes('1210:') || l.includes('1211:') || l.includes('1212:') || l.includes('1213:') || l.includes('1214:') || l.includes('1215:') || l.includes('1216:') || l.includes('1217:') || l.includes('1218:') || l.includes('1219:') || l.includes('1220:') || l.includes('1221:') || l.includes('1222:') || l.includes('1223:') || l.includes('1224:')) {
    console.log(l);
  }
});
