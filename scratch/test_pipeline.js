import { getPipelineImage } from '../src/utils/imagePipeline.js';

async function testPipeline() {
  const destinations = [
    { name: 'Amazon Rainforest', city: 'Amazon Rainforest', country: 'Brazil' },
    { name: 'Antarctic Desert', city: 'Antarctic Desert', country: 'Antarctica' },
    { name: 'Antarctica & South Georgia', city: 'Antarctica & South Georgia', country: 'Antarctica' },
    { name: 'Arashiyama Bamboo Grove', city: 'Arashiyama Bamboo Grove', country: 'Japan' }
  ];

  console.log('--- Testing live pipeline for destinations ---');
  for (const dest of destinations) {
    try {
      const result = await getPipelineImage(dest.name, dest.city, dest.country);
      console.log(`Query: ${dest.name} (${dest.city}, ${dest.country})`);
      if (result) {
        console.log(`Source: ${result.source}`);
        console.log(`URL: ${result.url}`);
        console.log(`Confidence: ${result.confidence}%`);
      } else {
        console.log('Result: null');
      }
      console.log('-----------------------------------');
    } catch (err) {
      console.error(`Error for ${dest.name}:`, err.message);
    }
  }
}

testPipeline();
