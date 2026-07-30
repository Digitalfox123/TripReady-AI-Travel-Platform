import fs from 'fs';

let content = fs.readFileSync('src/data/index.js', 'utf8');

const restoredBlock = `// === TRAVEL CATEGORIES ===
export const travelCategories = [
  { id: 'nature', name: 'Nature', icon: '🌿', gradient: 'from-green-400 to-emerald-600', description: 'Immerse in natural wonders' },
  { id: 'mountains', name: 'Mountains', icon: '🏔️', gradient: 'from-slate-400 to-slate-700', description: 'Conquer majestic peaks' },
  { id: 'beaches', name: 'Beaches', icon: '🏖️', gradient: 'from-cyan-400 to-blue-500', description: 'Paradise shores await' },
  { id: 'deserts', name: 'Deserts', icon: '🏜️', gradient: 'from-amber-400 to-orange-600', description: 'Golden sand adventures' },
  { id: 'historical', name: 'Historical', icon: '🏛️', gradient: 'from-amber-300 to-yellow-600', description: 'Walk through time' },
  { id: 'cities', name: 'Cities', icon: '🌆', gradient: 'from-purple-400 to-indigo-600', description: 'Urban exploration' },
  { id: 'skyscrapers', name: 'Skyscrapers', icon: '🏙️', gradient: 'from-blue-400 to-indigo-600', description: 'Touch the sky' },
  { id: 'forests', name: 'Forests', icon: '🌲', gradient: 'from-green-500 to-green-800', description: 'Deep in the wilderness' },
  { id: 'snow', name: 'Snow', icon: '❄️', gradient: 'from-blue-200 to-blue-500', description: 'Winter wonderlands' },
  { id: 'adventure', name: 'Adventure', icon: '🧗', gradient: 'from-red-400 to-orange-600', description: 'Thrill-seeking journeys' },
  { id: 'islands', name: 'Islands', icon: '🏝️', gradient: 'from-teal-400 to-cyan-600', description: 'Escape to paradise' },
  { id: 'cultural', name: 'Cultural', icon: '🎭', gradient: 'from-pink-400 to-rose-600', description: 'Rich heritage experiences' },
  { id: 'wildlife', name: 'Wildlife', icon: '🦁', gradient: 'from-yellow-400 to-amber-600', description: 'Meet the wild' }
];

// === FEATURES ===
export const features = [
  { id: 1, title: 'AI Trip Planning', description: 'Our advanced AI analyzes millions of data points to craft your perfect itinerary, considering weather, crowds, costs, and your personal preferences.', icon: 'Brain' },
  { id: 2, title: 'Smart Budget Estimation', description: 'Get real-time cost breakdowns for flights, hotels, food, transport, and activities — tailored to your travel style and destination.', icon: 'Calculator' },
  { id: 3, title: 'Personalized Recommendations', description: 'Discover hidden gems and curated experiences matched to your interests, travel history, and preferred adventure level.', icon: 'Sparkles' },
  { id: 4, title: 'Real-time Travel Guidance', description: 'Live weather updates, flight tracking, local events, and emergency information — all in one dashboard during your trip.', icon: 'Navigation' },
  { id: 5, title: 'Weather Intelligence', description: 'Advanced weather forecasting with climate analysis, best-time-to-visit predictions, and packing recommendations.', icon: 'CloudSun' },
  { id: 6, title: 'Local Cultural Insights', description: 'Understand customs, etiquette, local laws, dress codes, and cultural sensitivities before you arrive.', icon: 'Globe' },
  { id: 7, title: 'Smart Travel Checklist', description: 'AI-generated packing lists, document reminders, health advisories, and pre-trip preparation guides.', icon: 'CheckSquare' },
  { id: 8, title: 'Visa & Travel Requirements', description: 'Instant visa checks, requirements, and links to official portals for 150+ countries.', icon: 'FileText' },
  { id: 9, title: 'Interactive Route Maps', description: 'Visualize your route, highlight must-see spots, and optimize travel distances automatically.', icon: 'Map' }
];

// === FEATURED TESTIMONIALS ===
export const featuredTestimonials = [
  { id: 1, name: 'Sarah Chen', location: 'San Francisco, USA', avatar: '👩', rating: 5, text: 'Trip Ready completely transformed how I plan travel. The AI budget planner saved me $2,000 on my Japan trip. The destination insights were incredibly accurate and helpful!', trip: 'Tokyo, Japan' },
  { id: 2, name: 'Marco Rossi', location: 'Milan, Italy', avatar: '👨‍🎨', rating: 5, text: 'As a frequent traveler, I\\'ve tried every platform. Trip Ready is leagues ahead — the visa checker alone saved me from a potential disaster in Southeast Asia. Absolutely brilliant.', trip: 'Bali, Indonesia' },
  { id: 3, name: 'Aisha Al-Rashid', location: 'Dubai, UAE', avatar: '👩‍💻', rating: 5, text: 'The family trip planning feature is extraordinary. It considered our children\\'s ages, dietary needs, and activity preferences. Best family vacation ever to Maldives!', trip: 'Maldives' },
  { id: 4, name: 'James O\\'Brien', location: 'London, UK', avatar: '🧑‍🏫', rating: 5, text: 'The real-time currency converter and daily budget tracker kept me perfectly on track during my 3-week European adventure. This is the future of travel planning.', trip: 'European Tour' }
];

// === SCROLLING TESTIMONIALS ===
export const scrollingTestimonials = [
  { id: 5, name: 'Yuki Tanaka', avatar: '👩', text: 'Mind-blowing AI recommendations!', rating: 5 },
  { id: 6, name: 'Carlos Mendez', avatar: '👨', text: 'Budget planner is incredibly accurate.', rating: 5 },
  { id: 7, name: 'Emily Watson', avatar: '👩‍🦰', text: 'Best travel app I\\'ve ever used.', rating: 5 },
  { id: 8, name: 'Ahmed Hassan', avatar: '👨‍💼', text: 'Saved thousands with smart tips.', rating: 5 },
  { id: 9, name: 'Sophie Laurent', avatar: '👩‍🎤', text: 'The visa checker is a lifesaver!', rating: 4 },
  { id: 10, name: 'Raj Patel', avatar: '👨‍🎓', text: 'Highly recommend this app to everyone!', rating: 5 }
];

`;

const currenciesIndex = content.indexOf('export const currencies = [');

if (currenciesIndex !== -1) {
  const head = content.substring(0, currenciesIndex);
  const tail = content.substring(currenciesIndex);
  
  const finalContent = head + restoredBlock + tail;
  
  fs.writeFileSync('src/data/index.js', finalContent, 'utf8');
  console.log("Successfully restored all missing variables in src/data/index.js!");
} else {
  console.log("ERROR: Could not find currencies array start!");
}
