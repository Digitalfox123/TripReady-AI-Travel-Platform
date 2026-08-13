import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomSlider from '../components/ui/CustomSlider';
import YouTubeTravelSection from '../components/YouTubeTravelSection';
import {
  Calendar,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  SlidersHorizontal,
  Shield,
  Globe,
  Plus,
  Minus,
  Info,
  MapPin,
  Compass,
  Briefcase,
  HelpCircle,
  ChevronDown,
  BookOpen,
  Heart,
  Award,
  AlertCircle,
  Map,
  Plane,
  ChevronRight,
  Sparkles,
  Smile,
  Activity,
  Luggage,
  ShieldAlert,
  Train,
  Check,
  PlaneTakeoff,
  AlertTriangle,
  XCircle,
  User,
  Scissors,
  Ban,
  Fingerprint,
  Users,
  Sun,
  Accessibility,
  Calculator,
  Compass as CompassIcon,
  Star,
  Headphones,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

// Countries lists with currency and code for the Wizard (no emojis)
const COUNTRIES_LIST = [
  { name: 'Pakistan', code: 'PK', currency: 'PKR', defaultCity: 'Lahore' },
  { name: 'India', code: 'IN', currency: 'INR', defaultCity: 'Mumbai' },
  { name: 'Bangladesh', code: 'BD', currency: 'BDT', defaultCity: 'Dhaka' },
  { name: 'United States', code: 'US', currency: 'USD', defaultCity: 'New York' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', defaultCity: 'London' },
  { name: 'Canada', code: 'CA', currency: 'CAD', defaultCity: 'Toronto' },
  { name: 'Egypt', code: 'EG', currency: 'EGP', defaultCity: 'Cairo' },
  { name: 'United Arab Emirates', code: 'AE', currency: 'AED', defaultCity: 'Dubai' },
  { name: 'Turkey', code: 'TR', currency: 'TRY', defaultCity: 'Istanbul' },
  { name: 'Indonesia', code: 'ID', currency: 'IDR', defaultCity: 'Jakarta' },
  { name: 'Malaysia', code: 'MY', currency: 'MYR', defaultCity: 'Kuala Lumpur' }
];

const TRAVEL_MONTHS = [
  { name: 'January', temp: '24°C', crowd: 'Medium', best: true },
  { name: 'February', temp: '25°C', crowd: 'Medium', best: true },
  { name: 'March', temp: '29°C', crowd: 'High', best: false },
  { name: 'April', temp: '33°C', crowd: 'Very High (Ramadan)', best: false },
  { name: 'May', temp: '38°C', crowd: 'High', best: false },
  { name: 'June', temp: '42°C', crowd: 'Low', best: false },
  { name: 'July', temp: '43°C', crowd: 'Low', best: false },
  { name: 'August', temp: '42°C', crowd: 'Medium', best: false },
  { name: 'September', temp: '39°C', crowd: 'Medium', best: false },
  { name: 'October', temp: '35°C', crowd: 'Medium', best: true },
  { name: 'November', temp: '30°C', crowd: 'Medium', best: true },
  { name: 'December', temp: '26°C', crowd: 'High', best: true }
];

const CATEGORY_STYLES = {
  'Religious & Historical': {
    icon: Compass,
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20',
    text: 'text-emerald-750 dark:text-emerald-300'
  },
  'Religious & Pilgrimage': {
    icon: Compass,
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20',
    text: 'text-emerald-750 dark:text-emerald-300'
  },
  'Historic Islamic Landmarks': {
    icon: MapPin,
    bg: 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/20',
    text: 'text-teal-750 dark:text-teal-300'
  },
  'Ziyarat & Historical': {
    icon: MapPin,
    bg: 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/20',
    text: 'text-teal-750 dark:text-teal-300'
  },
  'Ziyarat & Battlefields': {
    icon: Award,
    bg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20',
    text: 'text-rose-750 dark:text-rose-300'
  },
  'Museums & Culture': {
    icon: BookOpen,
    bg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20',
    text: 'text-amber-750 dark:text-amber-300'
  },
  'Museums & Cultural': {
    icon: BookOpen,
    bg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20',
    text: 'text-amber-750 dark:text-amber-300'
  },
  'Shopping Malls': {
    icon: ShoppingBag,
    bg: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20',
    text: 'text-blue-750 dark:text-blue-300'
  },
  'Popular Markets (Souqs)': {
    icon: ShoppingBag,
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/20',
    text: 'text-indigo-750 dark:text-indigo-300'
  },
  'Traditional Markets (Souqs)': {
    icon: ShoppingBag,
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/20',
    text: 'text-indigo-750 dark:text-indigo-300'
  },
  'Family & Kids Activities': {
    icon: Smile,
    bg: 'bg-pink-500/10 dark:bg-pink-500/20 border-pink-500/20',
    text: 'text-pink-750 dark:text-pink-300'
  },
  'Parks & Family Attractions': {
    icon: Smile,
    bg: 'bg-pink-500/10 dark:bg-pink-500/20 border-pink-500/20',
    text: 'text-pink-750 dark:text-pink-300'
  },
  'Hidden Gems': {
    icon: Sparkles,
    bg: 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/20',
    text: 'text-purple-750 dark:text-purple-300'
  }
};

// Ziyarat Places in Makkah and Madinah
const MAKKAH_ATTRACTIONS = [
  {
    name: 'Masjid al-Haram',
    category: 'Religious & Historical',
    image: '/Makkah Images/Masjid al-Haram.jpg',
    description: 'The largest mosque in the world and the focal point of Islamic pilgrimage, surrounding the Kaaba.',
    history: 'Dating back to Prophet Ibrahim, it has been expanded over centuries by various Islamic rulers to accommodate millions.',
    tips: 'Usually least crowded between 10:00 AM to 12:00 PM, and 1:00 AM to 3:00 AM. Bring a shoe bag and stay hydrated.',
    coords: 'Center of Makkah'
  },
  {
    name: 'Kaaba',
    category: 'Religious & Historical',
    image: '/kaaba_arched.jpg',
    description: 'The sacred cuboid structure at the center of Masjid al-Haram, the Qibla for all Muslims worldwide.',
    history: 'Built by Ibrahim and Ismail. The Black Stone (Hajar al-Aswad) is set in its eastern corner.',
    tips: 'Avoid pushing to touch the Black Stone if it is crowded; pointing towards it during Tawaf is perfectly valid.',
    coords: 'Within Mataf Area'
  },
  {
    name: 'Zamzam Well',
    category: 'Religious & Historical',
    image: '/Makkah Images/Zamzam Well.jpg',
    description: 'The miraculous water source revealed to Hagar and infant Ismail in the barren valley of Mecca.',
    history: 'Flowing continuously for thousands of years, this blessed spring feeds the entire Masjid al-Haram.',
    tips: 'Drink standing, face the Kaaba, and supplicate with your heart\'s desire as it is a time of accepted prayers.',
    coords: 'Inside Masjid al-Haram'
  },
  {
    name: 'Safa and Marwah',
    category: 'Religious & Historical',
    image: '/Makkah Images/Safa and Marwah.jpg',
    description: 'Two historical hills inside Masjid al-Haram between which pilgrims walk/run during Sa\'i.',
    history: 'Commemorates Hagar\'s search for water for infant Ismail, culminating in the gushing of Zamzam.',
    tips: 'The total distance is 3.15 km (7 rounds). Air-conditioned and equipped with smooth marble floors.',
    coords: 'Inside Masjid al-Haram'
  },
  {
    name: 'Jabal al-Nour (غارِ حرا)',
    category: 'Religious & Historical',
    image: '/Makkah Images/Jabal al-Nour.jpg',
    description: 'The Mountain of Light, hosting the Cave of Hira where the Prophet received his first revelation.',
    history: 'Prophet Muhammad spent long periods meditating here before the first verses of Surah al-Alaq were revealed.',
    tips: 'A challenging 2-hour steep climb. Best climbed in the early morning (before sunrise) or after Asr.',
    coords: '4 km northeast of Kaaba'
  },
  {
    name: 'Jabal Thawr (غارِ ثور)',
    category: 'Religious & Historical',
    image: '/Makkah Images/Jabal Thawr.jpg',
    description: 'The mountain containing the cave where the Prophet and Abu Bakr hid during the migration to Madinah.',
    history: 'A spider spun a web and a dove laid eggs at the entrance to miraculously conceal them from the Quraysh.',
    tips: 'Requires a steep 2 to 3-hour hike. Sturdy footwear and plenty of water are absolutely essential.',
    coords: '4 km south of Kaaba'
  },
  {
    name: 'Mount Arafat',
    category: 'Religious & Historical',
    image: '/Makkah Images/Mount Arafat.jpg',
    description: 'The granite hill where the Prophet delivered his Farewell Sermon, a key site of Hajj.',
    history: 'Also known as Jabal al-Rahmah (Mountain of Mercy), it is where Adam and Hawwa reunited on Earth.',
    tips: 'Visiting outside the Hajj season is highly peaceful and allows you to walk to the top within 10 minutes.',
    coords: '20 km southeast of Mecca'
  },
  {
    name: 'Mina',
    category: 'Religious & Historical',
    image: '/Makkah Images/Mina.jpg',
    description: 'The valley of tents where Hajj pilgrims stay during the days of Tashreeq.',
    history: 'Features the world\'s largest temporary air-conditioned tent city, housing millions during Hajj.',
    tips: 'Best viewed from elevated lookouts or visited outside Hajj to appreciate the massive infrastructure.',
    coords: '8 km east of Kaaba'
  },
  {
    name: 'Muzdalifah',
    category: 'Religious & Historical',
    image: '/Makkah Images/Muzdalifah.jpg',
    description: 'An open plain between Arafat and Mina where Hajj pilgrims spend the night.',
    history: 'Pilgrims collect pebbles here for the stoning ritual and pray Fajr before moving to Mina.',
    tips: 'The Mashar al-Haram Mosque is located here and is beautifully illuminated at night.',
    coords: 'Between Arafat and Mina'
  },
  {
    name: 'Jamarat Bridge',
    category: 'Religious & Historical',
    image: '/Makkah Images/Jamarat Bridge.jpg',
    description: 'A multi-level pedestrian bridge in Mina used for the stoning of the pillars ritual.',
    history: 'Redesigned into a safe, modern multi-tiered structure to ensure smooth pilgrim traffic flow.',
    tips: 'Mainly visited during Hajj, but is a marvel of civil engineering to observe from nearby hills.',
    coords: 'Mina valley'
  },
  {
    name: 'Masjid Aisha',
    category: 'Religious & Historical',
    image: '/Makkah Images/Masjid Aisha.jpg',
    description: 'Also known as Masjid at-Taneem, the primary Miqat station for those residing in Makkah.',
    history: 'Named after Aisha who entered Ihram here during the Farewell Pilgrimage under the Prophet\'s guidance.',
    tips: 'Very easy to reach from Haram via local taxis or buses if you wish to start a secondary Umrah.',
    coords: '7.5 km north of Kaaba'
  },
  {
    name: 'Masjid al-Jinn',
    category: 'Religious & Historical',
    image: '/Makkah Images/Masjid al-Jinn.jpg',
    description: 'The historic mosque built on the site where a group of Jinn gathered to listen to the Quran.',
    history: 'Prophet Muhammad met the Jinn here, accepted their allegiance, and recited Surah al-Jinn to them.',
    tips: 'Located near the Jannat al-Mu\'alla cemetery, making it a quick and interesting historical stop.',
    coords: 'Near Jannat al-Mu\'alla'
  },
  {
    name: 'Jannat al-Mu\'alla Cemetery',
    category: 'Religious & Historical',
    image: '/Makkah Images/Jannat al-Mu\'alla Cemetery.jpg',
    description: 'The historic cemetery of Makkah where many of the Prophet\'s ancestors and relatives are buried.',
    history: 'Contains the graves of Khadijah (the Prophet\'s first wife), Abu Talib, and Abdul Muttalib.',
    tips: 'Respectful behavior is required. Best visited during daytime outside congregational prayer hours.',
    coords: 'North of Masjid al-Haram'
  },
  {
    name: 'Makkah Clock Tower Museum',
    category: 'Museums & Culture',
    image: '/Makkah Images/Makkah Clock Tower Museum.jpg',
    description: 'A museum occupying the top four floors of the Clock Tower, focusing on astronomy and space.',
    history: 'Showcases how the giant clock was built, astronomical measurements, and space exploration history.',
    tips: 'Offers the highest panoramic view of Masjid al-Haram from its open balcony. Tickets can be bought at the lobby.',
    coords: 'Abraj Al Bait Complex'
  },
  {
    name: 'Exhibition of the Two Holy Mosques Architecture',
    category: 'Museums & Culture',
    image: '/Makkah Images/Exhibition of the Two Holy Mosques Architecture.jpg',
    description: 'A museum displaying architectural relics, historical pillars, and old doors of the two holy mosques.',
    history: 'Houses priceless artifacts dating back to early Islamic eras, including old Kaaba covers and wooden pillars.',
    tips: 'Located slightly outside the city center. Perfect for a quiet afternoon learning about Haram\'s expansion.',
    coords: 'Umm al-Joud district'
  },
  {
    name: 'Revelation Exhibition',
    category: 'Museums & Culture',
    image: '/Makkah Images/Revelation Exhibition.webp',
    description: 'A state-of-the-art interactive exhibition telling the story of Quranic revelation and Prophethood.',
    history: 'Built at the foot of Jabal al-Nour to enrich the historical experience of visitors to Hira cave.',
    tips: 'Ideal to visit before hiking the mountain to understand the physical and spiritual journey of Hira.',
    coords: 'Foot of Jabal al-Nour'
  },
  {
    name: 'السلام عليك أيها النبي Exhibition',
    category: 'Museums & Culture',
    image: '/Makkah Images/السلام عليك أيها النبي Exhibition.jfif',
    description: 'An exhibition depicting the life and times of Prophet Muhammad using modern scientific and digital models.',
    history: 'Constructed to bring the Sunnah to life by showcasing replicas of items used in daily Prophetic life.',
    tips: 'Highly educational for children and families. Guided tours in multiple languages are available.',
    coords: 'Makkah bypass road'
  },
  {
    name: 'Makkah Mall',
    category: 'Shopping Malls',
    image: '/Makkah Images/Makkah Mall.jpg',
    description: 'A modern, massive shopping mall featuring international brands, dining, and kids entertainment.',
    history: 'A major commercial hub in Mecca catering to both residents and visiting pilgrims.',
    tips: 'Great place to buy high-quality gifts, abayas, and perfumes. Features a huge hypermarket.',
    coords: 'King Abdullah Rd'
  },
  {
    name: 'Al Hijaz Mall',
    category: 'Shopping Malls',
    image: '/Makkah Images/Al Hijaz Mall.jpg',
    description: 'A classic shopping destination hosting traditional gold merchants and modern clothing outlets.',
    history: 'One of the first major malls in Mecca, known for its family-friendly indoor amusement zone.',
    tips: 'Excellent for shopping abayas, local gold, and traditional Arabic clothing.',
    coords: 'Makkah-Jeddah Hwy'
  },
  {
    name: 'Al Diyafa Mall',
    category: 'Shopping Malls',
    image: '/Makkah Images/Al Diyafa Mall.jfif',
    description: 'A modern mall with a unique open-air architectural style, offering fashion boutiques and cafes.',
    history: 'Designed as a premium shopping spot with a focus on women\'s fashion and kids play zones.',
    tips: 'A quieter shopping experience compared to Makkah Mall, perfect for a relaxed evening stroll.',
    coords: 'Al Zaher district'
  },
  {
    name: 'Abraj Al Bait Mall',
    category: 'Shopping Malls',
    image: '/Makkah Images/Abraj Al Bait Mall.jpg',
    description: 'The multi-story mall located inside the Clock Tower complex immediately next to the Haram.',
    history: 'Built as part of the massive endowment project to serve pilgrims steps away from their hotels.',
    tips: 'Extremely convenient for quick meals at the food court, but gets highly crowded right after prayers.',
    coords: 'Next to Masjid al-Haram'
  },
  {
    name: 'Souq Al Aziziyah',
    category: 'Popular Markets (Souqs)',
    image: '/Makkah Images/Souq Al Aziziyah.webp',
    description: 'A busy market street popular for buying electronics, clothing, and cheap wholesale travel goods.',
    history: 'Serves as the main shopping hub for pilgrims staying in the Aziziyah district during Hajj and Umrah.',
    tips: 'Bargaining is expected. Prices here are significantly cheaper than stores directly around the Haram.',
    coords: 'Aziziyah district'
  },
  {
    name: 'Souq Al Otaibi',
    category: 'Popular Markets (Souqs)',
    image: '/Makkah Images/Souq Al Otaibi.jfif',
    description: 'One of Makkah\'s oldest traditional open-air bazaars, selling fabrics, spices, and perfumes.',
    history: 'A historic market that preserves the old-world trading culture of Hijaz.',
    tips: 'Highly recommended for authentic oud, traditional prayer rugs, and customized tailoring.',
    coords: 'Otaibiah district'
  },
  {
    name: 'Souq Al Kakiyah',
    category: 'Popular Markets (Souqs)',
    image: '/Makkah Images/Souq Al Aziziyah.webp',
    description: 'A massive wholesale market specialized in wholesale souvenirs, toys, and prayer beads.',
    history: 'The primary supplier of merchandise for smaller retail shops operating across Makkah.',
    tips: 'Buy in bulk (packs of 6 or 12) to get the best wholesale discounts on gifts for family.',
    coords: 'Kakiyah district'
  },
  {
    name: 'Al Hijaz Market',
    category: 'Popular Markets (Souqs)',
    image: '/Makkah Images/Al Hijaz Mall.jpg',
    description: 'A bustling local market offering affordable garments, gold jewelry, and local street foods.',
    history: 'A historic local market catering to the daily needs of Meccan residents.',
    tips: 'Try some traditional Arabic street snacks from local vendors at the market entrance.',
    coords: 'Al Hijaz district'
  },
  {
    name: 'Al Hokair Time',
    category: 'Family & Kids Activities',
    image: '/Makkah Images/Al Hokair Time (Indoor entertainment).webp',
    description: 'A large indoor family entertainment center featuring amusement rides and arcade games.',
    history: 'Part of Saudi Arabia\'s largest entertainment network, providing safe indoor play for children.',
    tips: 'Excellent to keep kids entertained in a fully climate-controlled space after performing rituals.',
    coords: 'Aziziyah district'
  },
  {
    name: 'KidZania at Makkah Mall',
    category: 'Family & Kids Activities',
    image: '/Makkah Images/Makkah Mall.jpg',
    description: 'An interactive indoor edutainment center where children role-play adult professions.',
    history: 'Brought to Makkah Mall to provide creative learning and play experiences for children.',
    tips: 'Ideal for children aged 4-14 years. Parents can safely leave kids under staff supervision.',
    coords: 'Inside Makkah Mall'
  },
  {
    name: 'King Abdullah Park',
    category: 'Family & Kids Activities',
    image: '/Makkah Images/King Abdullah Park.jpg',
    description: 'A spacious public park with green lawns, walking trails, kids playgrounds, and fountains.',
    history: 'Developed as a major green space to improve the quality of life for residents and visitors.',
    tips: 'Perfect for an evening family picnic. Highly pleasant after sunset when the weather cools down.',
    coords: 'Aziziyah district'
  },
  {
    name: 'Al Hussam Park',
    category: 'Family & Kids Activities',
    image: '/Makkah Images/Al Hussam Park.jpg',
    description: 'A newly developed community park offering walking paths and family seating areas.',
    history: 'A community green project providing a peaceful retreat from the busy city center.',
    tips: 'Great for a quiet morning stroll. Clean restrooms and small kiosks are available.',
    coords: 'Makkah outskirts'
  },
  {
    name: 'Hira Cultural District',
    category: 'Hidden Gems',
    image: '/Makkah Images/Revelation Exhibition.webp',
    description: 'A cultural destination near Jabal al-Nour featuring museums, galleries, and cultural walks.',
    history: 'Inaugurated to enrich the cultural and historical experience of pilgrims visiting the Hira cave.',
    tips: 'Has a great simulated cave exhibition, perfect for children or elderly unable to hike the mountain.',
    coords: 'Foot of Jabal al-Nour'
  }
];

const MADINAH_ATTRACTIONS = [
  {
    name: 'Al-Masjid an-Nabawi',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Al_Masjid_An-Nabawi.jpg',
    description: 'The Prophet\'s Mosque, the second-holiest site in Islam, featuring his tomb and the iconic Green Dome.',
    history: 'Established by Prophet Muhammad in 622 CE on his migration, expanded over centuries into a masterpiece.',
    tips: 'Open 24/7. To pray in the Rawdah, you must book a slot in advance using the Nusuk app.',
    coords: 'Center of Madinah'
  },
  {
    name: 'Rawdah',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Riyadhul_Jannah_Nabawi.jpg',
    description: 'A sacred area inside Al-Masjid an-Nabawi, designated as a garden of Paradise.',
    history: 'The Prophet stated: "Between my house and my pulpit lies a garden from the gardens of Paradise."',
    tips: 'Identified by its green carpets (the rest are red). Keep your prayers short to let other pilgrims enter.',
    coords: 'Inside Al-Masjid an-Nabawi'
  },
  {
    name: 'Prophet\'s Tomb',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/The_Green_Dome%2C_Masjid_Nabawi%2C_Madina.jpg',
    description: 'The final resting place of Prophet Muhammad, Abu Bakr, and Umar under the Green Dome.',
    history: 'Located in what was originally Aisha\'s chamber, incorporated into the mosque during early expansions.',
    tips: 'Lower your voice out of respect when sending greetings, and keep moving to prevent crowd congestion.',
    coords: 'Inside Al-Masjid an-Nabawi'
  },
  {
    name: 'Jannat al-Baqi',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Al-Baqi_cemetery.jpg',
    description: 'The oldest and first Islamic cemetery of Madinah, hosting graves of the Prophet\'s family.',
    history: 'Burials here include Uthman, Hasan, Aisha, and thousands of other early companions.',
    tips: 'Located immediately east of the Nabawi Mosque courtyard. Open to men after Fajr and Asr prayers.',
    coords: 'Adjacent to Nabawi Mosque'
  },
  {
    name: 'Quba Mosque',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Quba_Mosque_Full_Picture_%282024%29.jpg',
    description: 'The first mosque built in Islamic history, located on the outskirts of Madinah.',
    history: 'Prophet Muhammad laid its foundation stones. Praying two rak\'ahs here is rewarded with the reward of an Umrah.',
    tips: 'Walk the pedestrian path from Nabawi Mosque to Quba (3 km) in the morning following the Sunnah.',
    coords: '3 km south of Nabawi Mosque'
  },
  {
    name: 'Qiblatain Mosque',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Masjid_al-Qiblatayn.jpg',
    description: 'The Mosque of the Two Qiblas, where the revelation came to change the prayer direction.',
    history: 'In 624 CE, during prayer, the Prophet received revelation to turn from Jerusalem toward the Kaaba.',
    tips: 'Features unique architectural details. Easily visited via local hop-on hop-off tourist buses.',
    coords: 'Northwest Madinah'
  },
  {
    name: 'Masjid al-Jumu\'ah',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Masjid_al-Jumuah_Madinah.jpg',
    description: 'The mosque marking the site where the Prophet performed the first Friday congregational prayer.',
    history: 'Built on the spot where the Prophet stopped on his way from Quba to central Madinah.',
    tips: 'Located near Quba Mosque. A quick and peaceful visit, especially during weekdays.',
    coords: 'Near Quba Mosque'
  },
  {
    name: 'Masjid al-Ghamamah',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Masjid_al-Ghamama.jpg',
    description: 'The Mosque of the Cloud, where the Prophet performed the rain prayer (Istisqa).',
    history: 'A cloud was said to have miraculously shaded the Prophet from the hot sun during outdoor prayers here.',
    tips: 'Located just steps outside the southwest gate of Nabawi Mosque. An excellent photo spot.',
    coords: 'Southwest of Nabawi Mosque'
  },
  {
    name: 'Masjid Abu Bakr',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Abu_Bakr_Mosque_Madina.jpg',
    description: 'A historic mosque built on the site where Abu Bakr used to lead Eid prayers.',
    history: 'An Ottoman-era structure marking a location of early Islamic Eid congregations.',
    tips: 'Located adjacent to Masjid al-Ghamamah, easily visited on foot from the Nabawi Mosque courtyard.',
    coords: 'Southwest of Nabawi Mosque'
  },
  {
    name: 'Masjid Ali ibn Abi Talib',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Masjid_Ali_Madinah.jpg',
    description: 'A historic small mosque built where Ali ibn Abi Talib performed Eid prayers.',
    history: 'Built during the reign of Caliph Umar bin Abdul Aziz and renovated during the Ottoman era.',
    tips: 'Located very close to Masjid al-Ghamamah. Primarily visited for its historical architecture.',
    coords: 'Southwest of Nabawi Mosque'
  },
  {
    name: 'Masjid Umar ibn Al-Khattab',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Umar_Mosque_Madina.jpg',
    description: 'A small mosque commemorating the place where Umar ibn al-Khattab prayed.',
    history: 'Part of the cluster of historic mosques in the central district of Madinah.',
    tips: 'Right near Masjid al-Ghamamah, can be viewed from the outside while walking around the perimeter.',
    coords: 'Southwest of Nabawi Mosque'
  },
  {
    name: 'Seven Mosques',
    category: 'Religious & Pilgrimage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Sab%27u_Masajid.jpg',
    description: 'A complex of small historic mosques on the site of the Battle of the Trench.',
    history: 'Originally built at the command posts of the Prophet’s companions during the siege.',
    tips: 'The modern Al-Fath Mosque now stands on the hill overlooking these small historic structures.',
    coords: 'Mount Sela, Madinah'
  },
  {
    name: 'Mount Uhud',
    category: 'Historic Islamic Landmarks',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Jabal-e-Uhud.jpg',
    description: 'The famous mountain range that was the site of the second major battle in Islamic history.',
    history: 'The Battle of Uhud took place in 625 CE, testing the resolve of early Muslims.',
    tips: 'Climb the Archer\'s Hill (Jabal al-Rumaah) to get a full view of the battlefield. Best visited in the late afternoon.',
    coords: '5 km north of Nabawi Mosque'
  },
  {
    name: 'Martyrs of Uhud Cemetery',
    category: 'Historic Islamic Landmarks',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Jabal-e-Uhud.jpg',
    description: 'The burial ground of the 70 Muslim soldiers who fell during the Battle of Uhud.',
    history: 'Contains the graves of the Prophet’s uncle Hamza ibn Abdul-Muttalib and Mus\'ab ibn Umayr.',
    tips: 'Pay respects from the gated wall. Say the traditional greeting for martyrs.',
    coords: 'Foot of Mount Uhud'
  },
  {
    name: 'Battle of the Trench Site',
    category: 'Historic Islamic Landmarks',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Battle_of_Trench_627_CE.png',
    description: 'The historic area where early Muslims dug a trench to defend Madinah.',
    history: 'In 627 CE, Salman al-Farsi suggested digging a trench, rendering the enemy cavalry useless.',
    tips: 'Located at the foot of Mount Sela, right next to the Seven Mosques complex.',
    coords: 'Mount Sela'
  },
  {
    name: 'King Fahd Qur\'an Printing Complex',
    category: 'Historic Islamic Landmarks',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/King_Fahd_Complex_for_the_Printing_of_the_Holy_Quran_04.jpg',
    description: 'The largest Quranic printing press in the world, producing millions of copies annually.',
    history: 'Established in 1985 to print, translate, and distribute the Qur\'an globally.',
    tips: 'Open to male visitors in the morning. Pilgrims are usually gifted a free copy of the Qur\'an.',
    coords: 'North Madinah'
  },
  {
    name: 'Dar Al Madinah Museum',
    category: 'Museums & Cultural',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Dar_Al_Madinah_Museum_interior.jpg',
    description: 'The first specialized museum of Madinah\'s heritage, featuring models of the city\'s expansion.',
    history: 'Provides visual 3D models showing the city at the time of the Prophet and its evolution.',
    tips: 'Hire a museum guide to walk you through the models; the detailed history is highly educational.',
    coords: 'King Abdulaziz Rd'
  },
  {
    name: 'Prophet\'s Biography Museum',
    category: 'Museums & Cultural',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/International_Museum_of_the_Prophet_Biography.jpg',
    description: 'A state-of-the-art digital museum displaying the life, virtues, and miracles of the Prophet.',
    history: 'Inaugurated recently under the supervision of the Muslim World League directly next to Masjid Nabawi.',
    tips: 'Located right outside gate 8 of Masjid Nabawi. Book tickets online in advance.',
    coords: 'Next to Nabawi Mosque'
  },
  {
    name: 'Madinah Museum',
    category: 'Museums & Cultural',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Madinah-station.JPG',
    description: 'Housed in the historic Hejaz Railway Station, showcasing Madinah’s pre-Islamic and railway history.',
    history: 'Features old locomotives, station buildings, and archaeological artifacts of the region.',
    tips: 'Great for history buffs and photography. The Ottoman station architecture is beautifully preserved.',
    coords: 'Al-Rabiya district'
  },
  {
    name: 'Al Noor Mall',
    category: 'Shopping Malls',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Al_Noor_Mall_Madina.jpg',
    description: 'The most popular modern shopping mall in Madinah, housing retail brands and food courts.',
    history: 'Built to provide a premium shopping experience to locals and visitors in northern Madinah.',
    tips: 'Ideal for escaping the afternoon heat. Has a large supermarket for basic travel groceries.',
    coords: 'King Abdullah Rd'
  },
  {
    name: 'Al Rashid Mega Mall',
    category: 'Shopping Malls',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Al_Rashid_Mall_Medina.jpg',
    description: 'A massive shopping mall featuring a scenic indoor lake and kids entertainment.',
    history: 'A key modern lifestyle and shopping landmark in Madinah.',
    tips: 'Includes high-end international dining outlets and a massive play area for kids.',
    coords: 'Shurafah district'
  },
  {
    name: 'Al Manar Mall',
    category: 'Shopping Malls',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Al_Manar_Mall_entrance.jpg',
    description: 'A family-oriented shopping mall featuring a variety of fashion and accessory stores.',
    history: 'Designed as a convenient neighborhood shopping hub for local residents.',
    tips: 'Very close to Quba, making it a good stop after visiting Quba Mosque.',
    coords: 'King Abdullah Rd'
  },
  {
    name: 'Taiba Commercial Center',
    category: 'Shopping Malls',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Taiba_Commercial_Center_Exterior.jpg',
    description: 'A shopping complex located steps away from Al-Masjid an-Nabawi.',
    history: 'Serves as the primary shopping spot for pilgrims staying in northern hotels.',
    tips: 'Best place for buying prayer mats, abayas, dates, and Oud perfumes next to the Haram.',
    coords: 'North of Nabawi Mosque'
  },
  {
    name: 'Old Bazaar near Al-Masjid an-Nabawi',
    category: 'Traditional Markets (Souqs)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Old_Bazaar_Street_Medina.jpg',
    description: 'A lively traditional street market selling local garments, dates, and Islamic souvenirs.',
    history: 'A historic market quarter that has served pilgrims for generations.',
    tips: 'Haggling is highly recommended. Try Ajwa dates here, which are local to Madinah.',
    coords: 'Near Nabawi Mosque'
  },
  {
    name: 'Taiba Souq',
    category: 'Traditional Markets (Souqs)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Taiba_Bazaar.jpg',
    description: 'A bustling traditional indoor bazaar famous for gold jewelry, abayas, and local spices.',
    history: 'Stands as a historical marketplace known for traditional gold trading.',
    tips: 'Excellent place to purchase pure gold and authentic Madinah mint (Na\'na).',
    coords: 'Central area'
  },
  {
    name: 'King Fahd Central Park',
    category: 'Parks & Family Attractions',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/King_Fahd_Central_Park_Madinah.jpg',
    description: 'A huge green park featuring trees, walking tracks, play areas, and a small lake.',
    history: 'The largest public park in Madinah, acting as the green lungs of the city.',
    tips: 'Visit on weekend evenings to experience the lively family atmosphere and local food stalls.',
    coords: 'Al-Hadiqah district'
  },
  {
    name: 'Prince Mohammed bin Abdulaziz Park',
    category: 'Parks & Family Attractions',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Madinah_mountain_park.jpg',
    description: 'A hilltop park offering stunning panoramic views of the illuminated city of Madinah at night.',
    history: 'Developed on a high altitude point to offer scenic views of the holy city.',
    tips: 'Highly recommended to visit at night. Bring a jacket as the hilltop can get breezy.',
    coords: 'Uhud mountain slope'
  },
  {
    name: 'Madinah Zoo',
    category: 'Parks & Family Attractions',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Madinah_zoo_park.jpg',
    description: 'A modest animal park featuring local and exotic animals, bird enclosures, and play spaces.',
    history: 'Established to provide local kids and visitors with animal educational experiences.',
    tips: 'Check current operational hours; best visited with young children in the late afternoon.',
    coords: 'East Madinah'
  },
  {
    name: 'Wadi Al-Aqiq',
    category: 'Hidden Gems',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Wadi_Aqeeq_Medina.jpg',
    description: 'The blessed valley mentioned in Hadith, featuring green banks and walking pathways.',
    history: 'The Prophet was told by an angel to pray in this blessed valley during his Hajj journey.',
    tips: 'A beautiful place for walking during the winter season when water flows in the valley.',
    coords: 'Western Madinah'
  },
  {
    name: 'Bir Ghars',
    category: 'Hidden Gems',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Bir_Ghars_well.jpg',
    description: 'The historic well from which the Prophet drank and requested to be washed with its water.',
    history: 'One of the primary historic wells linked directly to the Prophet\'s daily life.',
    tips: 'Recently restored with a heritage visitor center. Very peaceful and spiritually significant.',
    coords: 'Qurban district'
  }
];

// Interactive Checklist items
const CHECKLIST_SECTIONS = {
  documents: [
    { id: 'doc1', text: 'Valid Passport (at least 6 months validity)' },
    { id: 'doc2', text: 'Umrah Visa or Electronic Tourist Visa printout' },
    { id: 'doc3', text: 'Nusuk App installed and account registered' },
    { id: 'doc4', text: 'Flight Tickets (Round trip printouts)' },
    { id: 'doc5', text: 'Hotel Booking confirmation details' },
    { id: 'doc6', text: 'Vaccination Certificates (Meningitis, Covid-19 if required)' },
    { id: 'doc7', text: 'Passport size photographs (soft and hard copies)' }
  ],
  clothing: [
    { id: 'cl1', text: '2 Sets of Ihram (for men - white seamless towels)' },
    { id: 'cl2', text: 'Ihram Belt / Money belt (to secure lower wrap)' },
    { id: 'cl3', text: '4-5 Sets of Loose, comfortable modest clothes (Abayas, Shalwar Kameez)' },
    { id: 'cl4', text: 'Lightweight jacket or shawl (Madinah nights can get cold)' },
    { id: 'cl5', text: 'Undergarments (breathable cotton fabric)' },
    { id: 'cl6', text: 'Sunglasses and wide-brim umbrella (for Makkah heat)' }
  ],
  footwear: [
    { id: 'fw1', text: 'Comfortable walking shoes/sneakers (for daily travel)' },
    { id: 'fw2', text: 'Unstitched, open sandals/slippers (men need ankles free in Ihram)' },
    { id: 'fw3', text: 'Thick cotton socks (for walking on hot Mataf tiles)' },
    { id: 'fw4', text: 'Shoe bag/drawstring bag (to carry footwear inside Haram)' }
  ],
  medication: [
    { id: 'md1', text: 'Personal prescription medicines (carry doctor’s letter)' },
    { id: 'md2', text: 'Painkillers (Paracetamol/Ibuprofen for muscle aches)' },
    { id: 'md3', text: 'Vaseline or anti-chafing cream (crucial for men walking in Ihram)' },
    { id: 'md4', text: 'Cough drops & throat lozenges (Haram cough is very common)' },
    { id: 'md5', text: 'Rehydration salts (ORSs) & Vitamin C tablets' },
    { id: 'md6', text: 'Adhesive bandages & antiseptic wipes' }
  ],
  electronics: [
    { id: 'el1', text: 'Smartphone & Charger' },
    { id: 'el2', text: 'High-capacity Power bank (crucial for long hours in Haram)' },
    { id: 'el3', text: 'Saudi Arabia travel adapter (Type G)' },
    { id: 'el4', text: 'Wired earphones (for listening to translations/supplications)' }
  ],
  essentials: [
    { id: 'es1', text: 'Pocket Quran or Du’a book' },
    { id: 'es2', text: 'Unscented soap, shampoo, and deodorant (perfumed soap is forbidden in Ihram)' },
    { id: 'es3', text: 'Small scissors/nail clipper (for shaving/cutting hair to exit Ihram)' },
    { id: 'es4', text: 'Prayer mat (portable/lightweight)' },
    { id: 'es5', text: 'Small reusable water bottle' },
    { id: 'es6', text: 'Hand sanitizer & wet wipes (fragrance-free)' }
  ]
};

// Accompanying 50 FAQs
const FAQS = [
  {
    q: "How much does Umrah cost?",
    a: "A basic 7-to-10-day Umrah package typically ranges between $800 to $1,500 per person, depending on country of origin, flight class, and proximity of hotels to the Haram. You can use our Budget Calculator on this page to configure customized estimates.",
    cat: "budgets"
  },
  {
    q: "How many days are enough for Umrah?",
    a: "Typically, 7 to 10 days are fully sufficient. This allows you 3 to 4 days in Makkah to complete the Umrah rituals and visit local holy sites, and 3 to 4 days in Madinah for worship at the Prophet’s Mosque and local Ziyarat tours.",
    cat: "budgets"
  },
  {
    q: "Can women perform Umrah alone?",
    a: "Yes. The Ministry of Hajj and Umrah of Saudi Arabia officially permits women of all ages to perform Umrah without a Mahram (male guardian), provided they travel with a group or have safe logistics secured.",
    cat: "rituals"
  },
  {
    q: "What should I pack for Umrah?",
    a: "Essential items include Ihram sheets, open sandals, unperfumed soap/shampoo, vaseline (to prevent chafing), a power bank, throat lozenges, travel documents, and comfortable footwear. Use our interactive checklist on this page to track your packing.",
    cat: "budgets"
  },
  {
    q: "When is the cheapest time to do Umrah?",
    a: "The cheapest months are usually Muharram and Safar (immediately following the Hajj season) and late spring (April/May). The most expensive times are during Ramadan and winter holidays (December/January).",
    cat: "budgets"
  },
  {
    q: "What is Umrah?",
    a: "Umrah is a voluntary pilgrimage to Makkah performed by Muslims at any time of the year. Unlike Hajj, which is compulsory once in a lifetime during specific days, Umrah consists of four core rituals: Ihram, Tawaf, Sa'i, and Halq/Taqsir.",
    cat: "rituals"
  },
  {
    q: "Is Umrah mandatory?",
    a: "Unlike Hajj, Umrah is generally considered a highly recommended sunnah (Sunnah Mu'akkadah) rather than a strict pillar of Islam. However, some schools of thought (like Shafi'i and Hanbali) view it as mandatory once in a lifetime if one has the physical and financial means.",
    cat: "rituals"
  },
  {
    q: "What is the difference between Hajj and Umrah?",
    a: "Hajj is one of the five pillars of Islam, performed only during the designated Islamic month of Dhu al-Hijjah, involving extensive rituals like staying in Arafat and Muzdalifah. Umrah is shorter, can be performed in under 3 hours, and is allowed at any time of the year.",
    cat: "rituals"
  },
  {
    q: "What should a woman in menstruation do during Umrah?",
    a: "A menstruating woman can enter Ihram and recite the Talbiyah, but she cannot enter Masjid al-Haram to perform Tawaf. She must wait in her hotel room until she becomes clean, perform ghusl (purification bath), and then complete her Tawaf, Sa'i, and hair cutting.",
    cat: "rituals"
  },
  {
    q: "How many times can you perform Umrah in one trip?",
    a: "While you can perform multiple Umrahs, Islamic scholars generally recommend focusing on a single, high-devotion Umrah, and then spending extra time doing voluntary Tawafs, which is the unique worship of Makkah.",
    cat: "rituals"
  },
  {
    q: "What is Tawaf and how is it performed?",
    a: "Tawaf is the ritual circumambulation of the Kaaba seven times in a counter-clockwise direction, starting and ending at the Black Stone (Hajar al-Aswad). Wudu (ablution) is mandatory for Tawaf.",
    cat: "rituals"
  },
  {
    q: "What is Sa'i and how is it performed?",
    a: "Sa'i involves walking seven times between the two hills of Safa and Marwah inside Masjid al-Haram. One round starts at Safa and ends at Marwah, and the next goes back from Marwah to Safa. Wudu is recommended but not mandatory for Sa'i.",
    cat: "rituals"
  },
  {
    q: "What is Halq and Taqsir?",
    a: "Halq is the complete shaving of the head (for men), which is highly recommended. Taqsir is the shortening of the hair by cutting at least an inch from all sides (mandatory for women, optional for men). This ritual marks the official exit from the state of Ihram.",
    cat: "rituals"
  },
  {
    q: "Can I perform Umrah on behalf of someone else?",
    a: "Yes, you can perform Umrah on behalf of a deceased person or a living person who is permanently disabled or too sick to travel, provided you have already completed your own personal Umrah first.",
    cat: "rituals"
  },
  {
    q: "What happens if I lose my wudu during Tawaf?",
    a: "If your wudu breaks during Tawaf, you must exit the Mataf, perform wudu, return, and resume your Tawaf. Most scholars advise resuming from the beginning of the specific round that was interrupted.",
    cat: "rituals"
  },
  {
    q: "What is the Talbiyah?",
    a: "The Talbiyah is the sacred chant recited repeatedly by pilgrims from the moment they enter Ihram until they begin Tawaf: 'Labbayk Allahumma Labbayk, Labbayka la sharika laka labbayk, Innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.'",
    cat: "rituals"
  },
  {
    q: "What are the boundaries of Haram (Sanctuary)?",
    a: "The Haram of Makkah is a sacred geographical boundary where cutting trees, hunting animals, or picking up lost items is strictly prohibited. Miqats are situated just outside these boundaries.",
    cat: "rituals"
  },
  {
    q: "Is there a specific supplication (Du'a) I must memorize for Tawaf?",
    a: "There are no mandatory du'as. You can pray in any language and recite any du'as or verses from the Quran. The only highly recommended sunnah du'a is between the Yemeni Corner and the Black Stone: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar.'",
    cat: "rituals"
  },
  {
    q: "What is Ramal during Tawaf?",
    a: "Ramal is the practice of jogging or marching quickly with short steps while shaking the shoulders. It is a sunnah for men only during the first three rounds of the arrival Tawaf.",
    cat: "rituals"
  },
  {
    q: "What is Ihram?",
    a: "Ihram is a sacred state of consecration a pilgrim must enter before crossing the Miqat boundaries. For men, it also refers to the physical attire consisting of two plain, white unstitched sheets of cloth.",
    cat: "ihram"
  },
  {
    q: "What is a Miqat?",
    a: "Miqats are specific geographic stations designated by the Prophet Muhammad where pilgrims must enter the state of Ihram and declare their intention before proceeding to Makkah.",
    cat: "ihram"
  },
  {
    q: "Can men wear stitched clothing in Ihram?",
    a: "No. Men are strictly prohibited from wearing stitched clothing, underwear, socks, hats, or covered shoes. Women can wear their normal stitched modest clothing and must keep their faces uncovered.",
    cat: "ihram"
  },
  {
    q: "Can I wear a belt or pouch in Ihram?",
    a: "Yes. Both men and women are allowed to wear a belt, waist pouch, or shoulder bag to hold passports, money, medicine, and phones, even if it has stitched seams.",
    cat: "ihram"
  },
  {
    q: "Can I use perfumed soap or shampoo in Ihram?",
    a: "No. Once you make the intention for Ihram, applying perfume or using scented soap, shampoo, lotions, or wet wipes is strictly forbidden. Carry fragrance-free toiletries.",
    cat: "ihram"
  },
  {
    q: "What happens if I accidentally violate an Ihram restriction?",
    a: "If a restriction is violated out of genuine forgetfulness or ignorance, there is no penalty, but you must stop the action immediately. If done intentionally, a penalty (Fidyah) in the form of fasting or feeding the poor is required.",
    cat: "ihram"
  },
  {
    q: "Can I take a bath or shower while in Ihram?",
    a: "Yes. You can take a bath or shower for hygiene or cooling off, but you must use fragrance-free soap and avoid scratching or scrubbing heavily to prevent pulling out any hair.",
    cat: "ihram"
  },
  {
    q: "Is it allowed to cover the head in Ihram?",
    a: "Men are strictly prohibited from covering their heads with caps, hoods, or the Ihram sheet itself. Utilizing an umbrella for shade is allowed. Women must cover their hair, but cannot wear a face veil (Niqab) or gloves.",
    cat: "ihram"
  },
  {
    q: "Can I cut my nails or hair before Ihram?",
    a: "Yes. It is highly recommended to clip your nails, trim your mustache, shave underarm/pubic hair, and take a ghusl (bath) before putting on the Ihram garments.",
    cat: "ihram"
  },
  {
    q: "What shoes should men wear in Ihram?",
    a: "Men must wear footwear that leaves the instep (top arch of the foot) and the ankles fully exposed. Flip-flops or simple open-toe sandals are ideal.",
    cat: "ihram"
  },
  {
    q: "Can I change my Ihram sheets if they get dirty?",
    a: "Yes. You can wash your Ihram sheets or replace them with a clean set of unstitched sheets at any time. The state of Ihram is spiritual and is not tied to a single set of clothes.",
    cat: "ihram"
  },
  {
    q: "Is scratching allowed in Ihram?",
    a: "Gentle scratching is allowed. However, you must be careful not to scratch aggressively to avoid breaking the skin or pulling out body hair, which violates Ihram rules.",
    cat: "ihram"
  },
  {
    q: "Can I wear a wristwatch or ring in Ihram?",
    a: "Yes. Wearing wristwatches, fitness bands, rings, and spectacles is fully permitted while in the state of Ihram.",
    cat: "ihram"
  },
  {
    q: "What is the Nusuk App?",
    a: "Nusuk is the official Saudi government app used by pilgrims to apply for permits to perform Umrah and schedule visits to pray in the Rawdah at the Prophet's Mosque in Madinah.",
    cat: "logistics"
  },
  {
    q: "Do I need a permit to perform Umrah?",
    a: "Yes. All pilgrims are legally required to obtain an Umrah permit through the Nusuk app before entering the Mataf area of Masjid al-Haram.",
    cat: "logistics"
  },
  {
    q: "How far in advance should I book the Rawdah permit?",
    a: "Slots for the Rawdah are extremely limited. It is recommended to check the Nusuk app daily and book your slot 3 to 4 weeks prior to your travel date.",
    cat: "logistics"
  },
  {
    q: "What visas are available for Umrah?",
    a: "Pilgrims can use a dedicated Umrah Visa, an Electronic Tourist Visa (eVisa), a Transit Visa, or a Visa on Arrival depending on nationality and residency status.",
    cat: "logistics"
  },
  {
    q: "How do I travel from Jeddah to Makkah?",
    a: "The fastest and most comfortable way is the Haramain High-Speed Railway train (approx. 35 minutes). Taxis, private cars, and SAPTCO buses are also readily available.",
    cat: "logistics"
  },
  {
    q: "Can I perform Umrah on a Tourist Visa?",
    a: "Yes. Citizens of eligible countries holding tourist eVisas or tourist visas on arrival can perform Umrah freely and visit historical sites in Saudi Arabia.",
    cat: "logistics"
  },
  {
    q: "What is the Haramain High-Speed Train?",
    a: "It is a 300 km/h high-speed rail line connecting Makkah, Jeddah, King Abdullah Economic City, and Madinah. It is the premier choice for transit between Makkah and Madinah.",
    cat: "logistics"
  },
  {
    q: "Where can I buy a local SIM card?",
    a: "SIM cards from local providers (STC, Mobily, Zain) can be purchased directly at the Jeddah (JED) or Madinah (MED) airports, or at official stores in Makkah and Madinah.",
    cat: "logistics"
  },
  {
    q: "Are credit cards widely accepted in Makkah and Madinah?",
    a: "Yes, major hotels, restaurants, shopping malls, and supermarkets accept credit cards. However, carry cash (Saudi Riyals) for small street vendors, taxis, and charity.",
    cat: "logistics"
  },
  {
    q: "How do I get a wheelchair in Masjid al-Haram?",
    a: "Free manual wheelchairs are available at designated points. Electric wheelchairs can be rented on the ground floor and mezzanine levels of Masjid al-Haram for Tawaf and Sa'i.",
    cat: "logistics"
  },
  {
    q: "What is the weather like in Makkah and Madinah?",
    a: "Both cities have a desert climate. Winters (November to February) are pleasant (20°C to 28°C). Summers (June to September) are extremely hot, often exceeding 42°C.",
    cat: "budgets"
  },
  {
    q: "What is Zamzam water?",
    a: "Zamzam is a holy water source inside Masjid al-Haram. It is provided free of charge in coolers throughout both holy mosques. It is highly recommended to drink Zamzam and pray for health.",
    cat: "budgets"
  },
  {
    q: "Can I bring Zamzam water back to my home country?",
    a: "Yes. Most airlines allow pilgrims to check in one pre-packaged 5-liter bottle of Zamzam water, which must be purchased at Jeddah or Madinah airports with an official seal.",
    cat: "budgets"
  },
  {
    q: "Are English speakers common in Saudi Arabia?",
    a: "Yes, English is widely spoken and understood by hotel staff, shopkeepers, taxi drivers, and mosque guides in both Makkah and Madinah.",
    cat: "budgets"
  },
  {
    q: "Are vaccines required for Umrah?",
    a: "Yes, the Meningococcal Meningitis vaccine is mandatory for all pilgrims. Depending on your country of origin, Polio or Yellow Fever vaccination certificates may also be required.",
    cat: "budgets"
  },
  {
    q: "What are some common mistakes during Tawaf?",
    a: "Common mistakes include pointing the entire body towards the Kaaba (except when starting), touching the Kaaba walls (which are perfumed) while in Ihram, and running during all seven rounds.",
    cat: "budgets"
  },
  {
    q: "What are the rules of visiting the Prophet’s Grave?",
    a: "When passing by the Prophet's grave, walk slowly, lower your voice, face the grave, and send greetings (Salam) quietly without raising your hands or making supplications to the grave itself.",
    cat: "budgets"
  },
  {
    q: "How do I get to Ziyarat (historical places) in Madinah?",
    a: "You can book local sightseeing taxis, hop-on hop-on tourist buses, or travel via organized group tour buses that depart daily from major hotels near the courtyards.",
    cat: "budgets"
  },
  {
    q: "Can I enter Madinah without wudu?",
    a: "Yes. Wudu is not a requirement to enter the city of Madinah or to visit the Prophet’s Mosque (although it is required for prayer and highly recommended for visiting the grave).",
    cat: "budgets"
  },
  {
    q: "What should I do if I get lost in the Haram?",
    a: "Masjid al-Haram has numbered gates (e.g. King Abdulaziz Gate 1, Bab al-Fahd 79). Always agree with your family members on a specific gate number as a meeting point in case you get separated.",
    cat: "budgets"
  }
];

export default function UmrahGuidePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('makkah');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [activeChecklist, setActiveChecklist] = useState('documents');
  const [activeFaqCat, setActiveFaqCat] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [openRitualStep, setOpenRitualStep] = useState(1);

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState(() => {
    const cached = localStorage.getItem('tripready_umrah_checklist_v2');
    return cached ? JSON.parse(cached) : {};
  });

  useEffect(() => {
    localStorage.setItem('tripready_umrah_checklist_v2', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleChecklistItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateChecklistProgress = (category) => {
    const items = CHECKLIST_SECTIONS[category] || [];
    if (items.length === 0) return 0;
    const completed = items.filter(item => checkedItems[item.id]).length;
    return Math.round((completed / items.length) * 100);
  };

  const totalChecklistProgress = useMemo(() => {
    const allItems = Object.values(CHECKLIST_SECTIONS).flat();
    if (allItems.length === 0) return 0;
    const completed = allItems.filter(item => checkedItems[item.id]).length;
    return Math.round((completed / allItems.length) * 100);
  }, [checkedItems]);

  // Interactive Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardCountry, setWizardCountry] = useState('Pakistan');
  const [wizardCity, setWizardCity] = useState('Lahore');
  const [wizardTravelers, setWizardTravelers] = useState(2);
  const [wizardMonth, setWizardMonth] = useState('December');
  const [wizardHotel, setWizardHotel] = useState('Standard');
  const [wizardFlight, setWizardFlight] = useState('Economy');
  const [wizardSubmitted, setWizardSubmitted] = useState(false);

  // Dynamic Itinerary duration state
  const [itineraryDays, setItineraryDays] = useState(7);

  // Budget Calculator State
  const [calcTravelers, setCalcTravelers] = useState(2);
  const [calcDays, setCalcDays] = useState(7);
  const [calcHotelTier, setCalcHotelTier] = useState('Standard');
  const [calcFlightClass, setCalcFlightClass] = useState('Economy');
  const [calcTransport, setCalcTransport] = useState('Train');

  const applyWizardRecommendation = () => {
    setCalcTravelers(wizardTravelers);
    setCalcHotelTier(wizardHotel);
    setCalcFlightClass(wizardFlight);
    setCalcDays(itineraryDays);
    document.getElementById('budget-calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic Budget Calculation Formula
  const budgetBreakdown = useMemo(() => {
    const flightRates = { Economy: 850, 'Premium Economy': 1350, Business: 2800 };
    const hotelRates = { Budget: 60, Standard: 130, Premium: 320, Luxury: 750 };
    const foodRate = 20; // per day per person
    const transportRates = { Bus: 15, Train: 45, Taxi: 60, Car: 140 };
    const visaRate = 110; // per person

    const flightTotal = flightRates[calcFlightClass] * calcTravelers;
    const hotelTotal = hotelRates[calcHotelTier] * calcDays * Math.ceil(calcTravelers / 2);
    const foodTotal = foodRate * calcDays * calcTravelers;
    
    let transportTotal = 0;
    if (calcTransport === 'Bus' || calcTransport === 'Train') {
      transportTotal = transportRates[calcTransport] * calcTravelers * 2;
    } else {
      transportTotal = transportRates[calcTransport] * 2;
    }

    const visaTotal = visaRate * calcTravelers;
    const grandTotal = flightTotal + hotelTotal + foodTotal + transportTotal + visaTotal;

    return {
      flights: flightTotal,
      hotels: hotelTotal,
      food: foodTotal,
      transport: transportTotal,
      visa: visaTotal,
      total: grandTotal,
      daily: Math.round(grandTotal / calcDays),
      perPerson: Math.round(grandTotal / calcTravelers)
    };
  }, [calcTravelers, calcDays, calcHotelTier, calcFlightClass, calcTransport]);

  // Itinerary generation data
  const recommendedItinerary = useMemo(() => {
    if (itineraryDays === 3) {
      return [
        { day: 1, title: 'Arrival & Umrah Rituals', desc: 'Arrive at Jeddah Airport in Ihram, take the high-speed Haramain Train to Makkah, check into hotel, and perform your core Umrah rituals (Tawaf, Sa\'i, and Halq/Taqsir) in the evening when temperatures drop.' },
        { day: 2, title: 'Rest & Voluntary Tawaf', desc: 'Rest from the pilgrimage, perform the five daily prayers inside Masjid al-Haram, and perform a voluntary (Nafli) Tawaf during the quiet hours of mid-morning.' },
        { day: 3, title: 'Ziyarat & Departure', desc: 'Visit historic Makkah sites (Jabal al-Nour & Cave of Hira) early morning, offer farewell prayers, purchase packaged Zamzam water, and check out for your departure flight.' }
      ];
    } else if (itineraryDays === 5) {
      return [
        { day: 1, title: 'Arrival & Core Umrah', desc: 'Transit from Jeddah to Makkah via taxi/train. Settle into hotel, rest, and perform Umrah in the evening.' },
        { day: 2, title: 'Spiritual prayers & Haram', desc: 'Focus on Quran recitation and voluntary prayers inside Masjid al-Haram. Visit the Makkah Museum in the afternoon.' },
        { day: 3, title: 'Makkah Ziyarat Tour', desc: 'Hire a guide to visit Cave of Hira, Jabal Thawr, Arafat, and Mina. Offer prayers at Masjid al-Haram.' },
        { day: 4, title: 'Day Trip to Madinah', desc: 'Take the morning Haramain Train to Madinah (2 hours). Offer prayers at Masjid an-Nabawi, visit the Prophet\'s Grave, and return to Makkah in the night.' },
        { day: 5, title: 'Farewell & Departure', desc: 'Perform a final voluntary Tawaf, pack bags, purchase Zamzam water, and transfer to Jeddah Airport for departure.' }
      ];
    } else if (itineraryDays === 7) {
      return [
        { day: 1, title: 'Arrival & Umrah', desc: 'Check in to your Makkah hotel, prepare mentally, and perform your Umrah rituals.' },
        { day: 2, title: 'Rest & Voluntary Prayers', desc: 'Focus on resting and praying the five Fard prayers inside the Haram. Experience drinking cold Zamzam water.' },
        { day: 3, title: 'Makkah Historical Sites', desc: 'Visit Mount Uhud-equivalent local hills, Jannat al-Mualla, and Summary Museum.' },
        { day: 4, title: 'Transit to Madinah', desc: 'Check out of Makkah hotel, take the Haramain Train to Madinah, check into hotel, and pray Maghrib & Isha at Al-Masjid an-Nabawi.' },
        { day: 5, title: 'Rawdah & Prophet’s Grave', desc: 'Enter the sacred Rawdah garden (using Nusuk Permit) for two rak’ahs, and send peace upon the Prophet.' },
        { day: 6, title: 'Madinah Ziyarat Tour', desc: 'Visit Quba Mosque (pray 2 rak’ahs for Umrah reward), Qiblatain Mosque, and the martyrs site at Mount Uhud.' },
        { day: 7, title: 'Farewell & Return Flight', desc: 'Send farewell greetings at the Prophet\'s Grave, buy local Ajwa dates, and travel to Madinah Airport for your flight home.' }
      ];
    } else if (itineraryDays === 10) {
      return [
        { day: 1, title: 'Arrival & Makkah Umrah', desc: 'Arrive in Makkah, check in, and perform your Umrah rituals.' },
        { day: 2, title: 'Haram Focus', desc: 'Spend the day doing voluntary worship, Quran recitation, and relaxing in the Haram courtyards.' },
        { day: 3, title: 'Cave of Hira Hike', desc: 'Early morning hike to Jabal al-Nour to view the Cave of Hira. Spend afternoon resting.' },
        { day: 4, title: 'Makkah Ziyarat Tour', desc: 'Tour of Mina, Muzdalifah, Arafat (Mount of Mercy), and Jabal Thawr.' },
        { day: 5, title: 'Second voluntary Umrah (Optional)', desc: 'Travel to Masjid Aisha (Taneem) to enter Ihram, and perform a second Umrah for a relative.' },
        { day: 6, title: 'Travel to Madinah', desc: 'Transit to Madinah via the high-speed Haramain Train. Enjoy the change in spiritual atmosphere.' },
        { day: 7, title: 'Masjid an-Nabawi & Rawdah', desc: 'Spend the day in worship. Access the Rawdah using your Nusuk app slot.' },
        { day: 8, title: 'Madinah Historical Sites', desc: 'Ziyarat tour of Quba Mosque, Qiblatain Mosque, Seven Mosques, and Mount Uhud battlefield.' },
        { day: 9, title: 'Jannat al-Baqi', desc: 'Visit the historic Baqi cemetery early morning, and spend the rest of the day in Al-Masjid an-Nabawi.' },
        { day: 10, title: 'Departure', desc: 'Say your farewells at Nabawi Mosque, shop for authentic dates, and check out for departure.' }
      ];
    } else { // 14 Days
      return [
        { day: 1, title: 'Arrival & Umrah', desc: 'Arrive, check in, and perform Umrah.' },
        { day: 2, title: 'Haram Devotion', desc: 'Spend the day inside Masjid al-Haram doing voluntary prayers.' },
        { day: 3, title: 'Ziyarat: Cave of Hira', desc: 'Early morning hike to Jabal al-Nour.' },
        { day: 4, title: 'Ziyarat: Hajj Sites', desc: 'Visit Mina, Muzdalifah, Plains of Arafat, and Mount of Mercy.' },
        { day: 5, title: 'Quran & Reflections', desc: 'Settle in the library of Haram, study Quran, and enjoy Makkah\'s spiritual energy.' },
        { day: 6, title: 'Optional Umrah via Ji\'ranah', desc: 'Enter Ihram at Ji\'ranah Miqat and perform a second Umrah.' },
        { day: 7, title: 'Ziyarat: Makkah Museum & Libraries', desc: 'Explore Islamic architecture history at local museums.' },
        { day: 8, title: 'Transit to Madinah', desc: 'Take the Haramain train. Settle into your hotel near Al-Masjid an-Nabawi.' },
        { day: 9, title: 'Worship at Nabawi Mosque', desc: 'Spend the day doing prayers and reading Quran under the giant umbrellas.' },
        { day: 10, title: 'Visit the Rawdah', desc: 'Worship in the garden of Paradise using your scheduled Nusuk permit.' },
        { day: 11, title: 'Ziyarat: Quba & Qiblatain Mosques', desc: 'Offer prayer at Quba Mosque and visit Qiblatain.' },
        { day: 12, title: 'Ziyarat: Uhud Battlefield', desc: 'Pay respects to the martyrs of Uhud and climb Jabal al-Rumaah.' },
        { day: 13, title: 'Madinah Cultural Libraries', desc: 'Visit local historical exhibitions and Quran museums.' },
        { day: 14, title: 'Farewell & Departure', desc: 'Perform final greetings at the Prophet\'s Grave, collect Zamzam, and fly out.' }
      ];
    }
  }, [itineraryDays]);

  // SEO Structured Data Injection
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQS.slice(0, 10).map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin + "/" },
        { "@type": "ListItem", "position": 2, "name": "Destinations", "item": window.location.origin + "/destinations" },
        { "@type": "ListItem", "position": 3, "name": "Umrah Guide", "item": window.location.href }
      ]
    };

    const s1 = document.createElement('script');
    s1.type = 'application/ld+json';
    s1.innerHTML = JSON.stringify(faqSchema);
    s1.id = 'faq-jsonld-schema';
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.type = 'application/ld+json';
    s2.innerHTML = JSON.stringify(breadcrumbSchema);
    s2.id = 'breadcrumb-jsonld-schema';
    document.head.appendChild(s2);

    return () => {
      document.getElementById('faq-jsonld-schema')?.remove();
      document.getElementById('breadcrumb-jsonld-schema')?.remove();
    };
  }, []);

  const filteredFaqs = useMemo(() => {
    if (activeFaqCat === 'all') return FAQS;
    return FAQS.filter(f => f.cat === activeFaqCat);
  }, [activeFaqCat]);

  return (
    <div className="min-h-screen bg-slate-50/90 dark:bg-[#020813] text-[var(--text-primary)] transition-colors duration-500 pb-24 font-sans text-left overflow-x-hidden relative">
      {/* Noise filter */}
      <svg className="absolute w-0 h-0 opacity-0 pointer-events-none select-none">
        <filter id="premium-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.02 0" />
        </filter>
      </svg>
      
      {/* Dynamic light glowing blobs for SaaS depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-[10%] left-0 w-full max-w-[500px] h-[300px] bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none overflow-hidden" />
        <div className="absolute top-[35%] right-0 w-full max-w-[600px] h-[300px] bg-amber-500/[0.02] dark:bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none overflow-hidden" />
        <div className="absolute top-[65%] left-0 w-full max-w-[550px] h-[300px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none overflow-hidden" />
        <div className="absolute bottom-[5%] right-0 w-full max-w-[650px] h-[300px] bg-amber-500/[0.03] dark:bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none overflow-hidden" />
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.8]" style={{ filter: 'url(#premium-noise)' }} />
      </div>

      {/* 1. HERO SECTION — Fully Reconstructed */}
      <div className="w-full relative overflow-hidden -mt-[78px] z-10">
        
        {/* Background Image — Full bleed */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/umrah_hero.jpg" 
            alt="Pilgrims at Masjid al-Haram" 
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 35%' }}
          />
        </div>

        {/* Left-side soft gradient for text readability — NOT a black shadow, just a gentle fade */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#0a1628]/75 via-[#0a1628]/40 to-transparent" />
        
        {/* Bottom blend into page background */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-50 dark:from-[#020813] to-transparent z-[1] pointer-events-none" />

        {/* Content Layer */}
        <div className="relative z-10 pt-[78px]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col pt-6 pb-14 min-h-[560px] sm:min-h-[620px]">
            
            {/* Top spacer — pushes breadcrumbs down from navbar */}
            <div className="flex-1" />

            {/* Breadcrumbs — centered between navbar and SPIRITUAL DESTINATION HUB */}
            <nav className="flex items-center gap-2 text-xs font-semibold select-none">
              <Link to="/" className="text-white/60 hover:text-[#10B981] transition-colors duration-200">Home</Link>
              <ChevronRight size={10} className="text-white/30" />
              <Link to="/pilgrimage" className="text-white/60 hover:text-[#10B981] transition-colors duration-200">Pilgrimage Hub</Link>
              <ChevronRight size={10} className="text-white/30" />
              <span className="text-white/90">Umrah Guide</span>
            </nav>

            {/* Bottom spacer — gap between breadcrumbs and main content */}
            <div className="flex-1" />

            {/* Main Content */}
            <div className="max-w-3xl space-y-5 text-left">
              
              {/* Category Tag */}
              <div 
                className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.25em] select-none"
                style={{ fontFamily: '"Outfit", sans-serif', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
              >
                SPIRITUAL DESTINATION HUB
              </div>
              
              {/* Headline — Bold text shadow for prominence on any background */}
              <h1 
                className="text-5xl sm:text-6xl md:text-[68px] text-white tracking-tight leading-[1.08]"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4), 0 4px 40px rgba(0,0,0,0.2)' }}
              >
                <span className="font-light block" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300 }}>
                  Complete Umrah Guide
                </span>
                <span 
                  className="font-serif italic font-normal block mt-1 text-[#10B981]" 
                  style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, textShadow: '0 2px 16px rgba(16,185,129,0.3), 0 4px 30px rgba(0,0,0,0.3)' }}
                >
                  for Pilgrims.
                </span>
              </h1>
              
              {/* Description — with subtle shadow for readability */}
              <p 
                className="text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-2xl"
                style={{ fontFamily: '"Inter", sans-serif', textShadow: '0 1px 10px rgba(0,0,0,0.4)' }}
              >
                Everything you need for a spiritually fulfilling Umrah journey.{' '}
                <br className="hidden sm:inline" />
                Plan your pilgrimage, discover sacred places, estimate your budget,
                explore itineraries, and receive AI-powered guidance.
              </p>

              {/* Action Buttons — Glassmorphism, visible in BOTH light & dark */}
              <div className="pt-3 flex flex-wrap gap-3 items-center">
                {/* Primary CTA */}
                <button 
                  onClick={() => document.getElementById('planner-wizard')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-7 py-3.5 rounded-2xl bg-[#10B981] text-white font-bold text-[11px] uppercase tracking-[0.15em] flex items-center gap-2.5 shadow-[0_8px_32px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <Compass className="w-4 h-4 relative z-[1]" />
                  <span className="relative z-[1]">Plan My Umrah</span>
                </button>
                
                {/* Secondary CTA — Dark glass pill */}
                <button 
                  onClick={() => document.getElementById('budget-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3.5 rounded-2xl border border-white/20 bg-black/30 backdrop-blur-md text-white font-bold text-[11px] uppercase tracking-[0.15em] flex items-center gap-2.5 hover:bg-black/40 hover:border-white/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Budget</span>
                </button>
                
                {/* Tertiary CTA — Subtle glass */}
                <button 
                  onClick={() => document.getElementById('itinerary-generator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3.5 rounded-2xl bg-black/20 backdrop-blur-sm text-white/90 hover:text-white font-bold text-[11px] uppercase tracking-[0.15em] flex items-center gap-2.5 hover:bg-black/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Itinerary</span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>



      {/* 3. QUICK INFORMATION CARDS SECTION (Clean, spaced, not overlapping) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="premium-glass-card p-5 rounded-3xl text-left shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-600 dark:text-emerald-400 mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Best Time</span>
            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white block mt-1 leading-snug">Oct - Feb (Cooler)</span>
          </div>

          <div className="premium-glass-card p-5 rounded-3xl text-left shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-600 dark:text-emerald-400 mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Average Cost</span>
            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white block mt-1 leading-snug">$800 - $1,500</span>
          </div>

          <div className="premium-glass-card p-5 rounded-3xl text-left shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-600 dark:text-emerald-400 mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Average Duration</span>
            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white block mt-1 leading-snug">7 - 14 Days Ideal</span>
          </div>

          <div className="premium-glass-card p-5 rounded-3xl text-left shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-600 dark:text-emerald-400 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Visa Requirement</span>
            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white block mt-1 leading-snug">Nusuk / eVisa Online</span>
          </div>
        </div>

        {/* Extra Quick Info Details Grid (Emojis replaced with professional Lucide icons) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-4">
          <div className="premium-glass-card p-4 rounded-2xl text-left shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center"><Sun size={15} /></div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Makkah Weather</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Hot Desert (24-43°C)</span>
            </div>
          </div>

          <div className="premium-glass-card p-4 rounded-2xl text-left shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><Users size={15} /></div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Crowd Levels</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">High (Peak in Ramadan)</span>
            </div>
          </div>

          <div className="premium-glass-card p-4 rounded-2xl text-left shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><Heart size={15} /></div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Family Friendly</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Excellent (All Ages)</span>
            </div>
          </div>

          <div className="premium-glass-card p-4 rounded-2xl text-left shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center"><Accessibility size={15} /></div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Senior Citizens</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Good (Electric Carts)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE PLANNER WIZARD SECTION */}
      <div id="planner-wizard" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 overflow-hidden">
        {/* Section Background Decoration */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Circular Radial Blueprint Lines (Top Right) */}
          <svg className="absolute -top-16 -right-16 w-80 h-80 text-emerald-500/[0.04] dark:text-emerald-400/[0.06] animate-pulse-subtle" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1.5 1.5" />
            <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
            <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
          </svg>

          {/* Circular Radial Blueprint Lines (Bottom Left) */}
          <svg className="absolute -bottom-16 -left-16 w-80 h-80 text-emerald-500/[0.04] dark:text-emerald-400/[0.06] animate-pulse-subtle" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1.5 1.5" />
          </svg>

          {/* Dotted Islamic Geometric Star Pattern (Bottom Right) */}
          <svg className="absolute -bottom-12 right-12 w-64 h-64 text-amber-500/[0.03] dark:text-amber-400/[0.05] animate-float-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
            <polygon points="50,5 95,50 50,95 5,50" />
            <polygon points="50,5 95,50 50,95 5,50" transform="rotate(45 50 50)" />
            <polygon points="50,5 95,50 50,95 5,50" transform="rotate(22.5 50 50)" strokeDasharray="1 1" />
            <polygon points="50,5 95,50 50,95 5,50" transform="rotate(67.5 50 50)" strokeDasharray="1 1" />
            <circle cx="50" cy="50" r="38" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="28" />
            <circle cx="50" cy="50" r="18" strokeDasharray="1 2" />
          </svg>

          {/* Soft Glass Glow behind cards */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-amber-500/[0.02] dark:bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 premium-glass-card p-6 sm:p-12 rounded-[32px] text-center overflow-hidden">
          <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 mb-10">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.25em] block font-mono">Curation Wizard</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight text-balance">
              Interactive Umrah Planner
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto font-body text-pretty">
              Provide your details to generate an authentic departure, lodging, and pricing strategy report.
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mb-10 select-none max-w-xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div 
                key={step} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  wizardStep === step 
                    ? 'w-10 bg-emerald-600' 
                    : wizardStep > step 
                    ? 'w-4 bg-emerald-600/40' 
                    : 'w-4 bg-slate-200 dark:bg-white/[0.05]'
                }`}
              />
            ))}
          </div>

          {/* Step Panels */}
          <div className="min-h-[220px] flex items-center justify-center max-w-2xl mx-auto">
            {!wizardSubmitted ? (
              <div className="w-full space-y-6">
                {/* Step 1: Select Country */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      <span>Where are you departing from?</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {COUNTRIES_LIST.slice(0, 8).map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setWizardCountry(c.name);
                            setWizardCity(c.defaultCity);
                          }}
                          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                            wizardCountry === c.name
                              ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold scale-[1.02]'
                              : 'bg-slate-50 dark:bg-white/[0.01] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-mono font-bold text-xs mx-auto mb-1.5">{c.code}</span>
                          <span className="text-xs block font-body font-bold">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Select City */}
                {wizardStep === 2 && (
                  <div className="space-y-4 max-w-sm mx-auto">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>What is your departure city?</span>
                    </h3>
                    <input 
                      type="text" 
                      value={wizardCity}
                      onChange={(e) => setWizardCity(e.target.value)}
                      placeholder="e.g. London, Lahore, New York"
                      className="w-full text-center px-4 py-3 rounded-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-body font-bold"
                    />
                  </div>
                )}

                {/* Step 3: Travelers Count */}
                {wizardStep === 3 && (
                  <div className="space-y-6 max-w-sm mx-auto">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
                      <span>How many people are traveling?</span>
                    </h3>
                    <div className="flex items-center justify-center gap-6">
                      <button 
                        onClick={() => setWizardTravelers(prev => Math.max(1, prev - 1))}
                        className="p-3.5 rounded-full border border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white transition-all active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-4xl font-bold text-slate-800 dark:text-white">{wizardTravelers}</span>
                      <button 
                        onClick={() => setWizardTravelers(prev => prev + 1)}
                        className="p-3.5 rounded-full border border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Month */}
                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>When do you intend to perform Umrah?</span>
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {TRAVEL_MONTHS.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => setWizardMonth(m.name)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            wizardMonth === m.name
                              ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold scale-[1.02]'
                              : 'bg-slate-50 dark:bg-white/[0.02] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="text-[11px] font-bold block font-body">{m.name}</span>
                          <span className="text-[9px] text-slate-400 block mt-1 font-mono font-bold">{m.temp}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Hotel Tier */}
                {wizardStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-500" />
                      <span>What is your hotel preference?</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Budget', 'Standard', 'Premium', 'Luxury'].map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setWizardHotel(tier)}
                          className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between cursor-pointer ${
                            wizardHotel === tier
                              ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold scale-[1.02]'
                              : 'bg-slate-50 dark:bg-white/[0.02] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="text-xs font-bold block font-body">{tier}</span>
                          <span className="text-[9px] text-slate-400 block mt-2 font-mono leading-normal">
                            {tier === 'Budget' ? '2-3 Star, Shuttle service' : 
                             tier === 'Standard' ? '3-4 Star, 15-20 min walk' : 
                             tier === 'Premium' ? '5 Star, Close proximity' : 'Luxury Front row view'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Flight Class */}
                {wizardStep === 6 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                      <Plane className="w-4 h-4 text-emerald-500" />
                      <span>Select Flight Cabin Preference</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['Economy', 'Premium Economy', 'Business'].map((cls) => (
                        <button
                          key={cls}
                          onClick={() => setWizardFlight(cls)}
                          className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                            wizardFlight === cls
                              ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold scale-[1.02]'
                              : 'bg-slate-50 dark:bg-white/[0.02] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="text-xs font-bold block font-body">{cls}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Advanced AI Curation Dossier Report (Highly visual SaaS briefing layout) */
              <div className="w-full text-left bg-slate-900 border border-slate-850 p-6 sm:p-8 rounded-3xl animate-fade-in space-y-6 shadow-2xl shadow-emerald-950/20 relative overflow-hidden text-slate-200">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                  <Sparkles size={120} className="text-white" />
                </div>

                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">AI Travel Intelligence Dossier</h3>
                      <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-mono block mt-0.5">TR-90432-UMRAH • SYSTEM GENERATED</span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-mono">Date Generated</span>
                    <span className="text-xs font-bold text-white font-mono">12 July 2026</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-4">
                    {/* 1. Window & Seasonal Climate */}
                    <div className="space-y-1 bg-slate-950/40 p-4 rounded-2xl border border-white/[0.03]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">1. Departure & Climate ({wizardMonth})</span>
                      <p className="text-xs font-light text-slate-300 leading-relaxed font-body mt-1">
                        Departing from <strong className="text-white">{wizardCity}, {wizardCountry}</strong>. 
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-white/[0.05]">
                        {wizardMonth === 'June' || wizardMonth === 'July' || wizardMonth === 'August' || wizardMonth === 'May' ? (
                          <div className="text-amber-500 font-bold flex items-start gap-1.5 text-xs leading-normal">
                            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                            <span>Extreme Heat warning: Peak temperatures exceed 40°C. Rest during daytime; perform rituals exclusively after Isha or at sunrise. Keep hydrated.</span>
                          </div>
                        ) : (
                          <div className="text-emerald-400 font-bold flex items-start gap-1.5 text-xs leading-normal">
                            <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                            <span>Pleasant winter/spring weather. Crowds are high, but walking is comfortable. Dress warmly for cool Madinah nights.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 2. Flights & Commute */}
                    <div className="space-y-1 bg-slate-950/40 p-4 rounded-2xl border border-white/[0.03]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">2. Flights & Luggage Briefing</span>
                      <p className="text-xs font-light text-slate-300 leading-relaxed font-body mt-1">
                        For your <strong className="text-white">{wizardFlight}</strong> booking:
                      </p>
                      <ul className="text-[11px] text-slate-400 space-y-1.5 mt-2 list-disc pl-4 font-body leading-relaxed">
                        <li>Saudi Arabian Airlines, Emirates, or Turkish Airlines recommended for best Miqat notifications in-flight.</li>
                        <li>Carry unstitched Ihram sheets in your cabin baggage, NOT checked bags.</li>
                        <li>Standard baggage allowance applies: 2x 23kg check-in, 7kg cabin max.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* 3. Lodging & Transit */}
                    <div className="space-y-1 bg-slate-950/40 p-4 rounded-2xl border border-white/[0.03]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">3. Lodging & Transit Strategy</span>
                      <p className="text-xs font-light text-slate-300 leading-relaxed font-body mt-1">
                        Lodging Selected: <strong className="text-white">{wizardHotel} hotel</strong>.
                      </p>
                      <p className="text-xs font-light text-slate-400 leading-relaxed font-body mt-1.5">
                        {wizardHotel === 'Budget' ? 'Prioritize hotels with dedicated shuttle paths. Taxis to/from Ibrahim Al-Khalil road cost 10-15 SAR per trip.' :
                         wizardHotel === 'Standard' ? 'Look for 3-4 Star options in Ajyad or Ibrahim Al-Khalil street to guarantee walking times under 15 minutes.' :
                         wizardHotel === 'Premium' ? '5 Star close proximity hotel recommended. Book early to secure Kaaba view rooms.' :
                         'Luxury Front row hotel selected. Instant access to the Haram courtyard.'}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-white/[0.05] text-[11px] text-slate-400 font-body leading-relaxed">
                        <strong>Haramain High-Speed Train:</strong> Book tickets online 60 days in advance. Post-immigration, take the escalator to airport railway station.
                      </div>
                    </div>

                    {/* 4. Action Recommendation */}
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold block font-mono">Configuration recommendation</span>
                        <span className="text-xs text-slate-300 font-body block mt-0.5">{wizardTravelers} Pilgrims • {wizardFlight}</span>
                      </div>
                      <button
                        onClick={applyWizardRecommendation}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
                      >
                        Apply to Calculator
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-center gap-4 select-none">
            {wizardStep > 1 && !wizardSubmitted && (
              <button
                onClick={() => setWizardStep(prev => prev - 1)}
                className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                Back
              </button>
            )}
            
            {!wizardSubmitted ? (
              <button
                onClick={() => {
                  if (wizardStep === 6) {
                    setWizardSubmitted(true);
                  } else {
                    setWizardStep(prev => prev + 1);
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-slate-800 text-white dark:bg-white dark:text-[#020813] font-bold text-xs uppercase tracking-wider hover:scale-102 active:scale-98 transition-transform cursor-pointer"
              >
                {wizardStep === 6 ? 'Submit' : 'Next'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setWizardStep(1);
                  setWizardSubmitted(false);
                }}
                className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. BUDGET CALCULATOR SECTION */}
      <div id="budget-calculator" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-left overflow-hidden">
        {/* Section Background Decoration */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Topographic travel contour lines (subtle 4% opacity) */}
          <svg className="absolute top-0 right-0 w-96 h-96 text-emerald-500/[0.03] dark:text-emerald-400/[0.05]" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="0.6">
            <path d="M50,100 C150,50 250,150 350,100" />
            <path d="M30,130 C130,80 230,180 370,130" />
            <path d="M10,160 C110,110 210,210 390,160" strokeDasharray="3 3" />
            <path d="M0,190 C90,140 190,240 400,190" />
            <path d="M-20,220 C70,170 170,270 410,220" />
            <path d="M-40,250 C50,200 150,300 420,250" strokeDasharray="2 4" />
          </svg>

          {/* Thin flowing gold/emerald ribbon lines (Apple style curves) */}
          <svg className="absolute bottom-4 left-4 w-80 h-60 text-amber-500/[0.04] dark:text-amber-400/[0.06] animate-pulse-subtle" viewBox="0 0 300 200" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M10,190 C100,100 200,250 290,10" />
            <path d="M20,195 C110,105 210,255 300,15" strokeWidth="0.4" strokeDasharray="4 2" />
            <path d="M0,180 C80,80 180,230 280,0" stroke="currentColor" opacity="0.3" strokeWidth="0.5" />
          </svg>

          {/* Soft Glass Glow behind cards */}
          <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[320px] h-[320px] bg-amber-500/[0.02] dark:bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (Left side) */}
          <div className="lg:col-span-7 premium-glass-card p-6 sm:p-8 rounded-[28px] space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full mb-3">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Budget Configuration</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">Umrah Cost Calculator</h3>
              <p className="text-xs text-slate-400 font-light mt-1 font-body">Modify variables to dynamically project flight, accommodation, visa, and local commute fees.</p>
            </div>

            <div className="space-y-6">
              {/* Sliders for Travelers and Days — Image 2 UI/UX Redesign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <CustomSlider
                    label="NUMBER OF TRAVELERS"
                    min={1}
                    max={10}
                    value={calcTravelers}
                    onChange={setCalcTravelers}
                    unit="Pilgrims"
                    ticks={['1', '3', '5', '7', '10']}
                  />
                </div>

                <div>
                  <CustomSlider
                    label="DURATION (DAYS)"
                    min={3}
                    max={30}
                    value={calcDays}
                    onChange={setCalcDays}
                    unit="Days"
                    ticks={['3d', '7d', '10d', '14d', '21d', '30d']}
                  />
                </div>
              </div>

              {/* Selector Tabs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Hotel Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Budget', label: 'Budget', desc: '2-3 Star' },
                      { id: 'Standard', label: 'Standard', desc: '3-4 Star' },
                      { id: 'Premium', label: 'Premium', desc: '5 Star' },
                      { id: 'Luxury', label: 'Luxury', desc: 'Front Row' }
                    ].map(h => (
                      <button
                        key={h.id}
                        onClick={() => setCalcHotelTier(h.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          calcHotelTier === h.id
                            ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'bg-slate-50 dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.04] text-slate-500 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs block font-bold font-body">{h.label}</span>
                        <span className="text-[9px] text-slate-400 block font-mono">{h.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Flight Cabin Class</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Economy', 'Premium Economy', 'Business'].map(cls => (
                        <button
                          key={cls}
                          onClick={() => setCalcFlightClass(cls)}
                          className={`p-2 rounded-xl border text-center text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            calcFlightClass === cls
                              ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-450'
                              : 'bg-slate-50 dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.04] text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Local Transport Option</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'Bus', label: 'Bus' },
                        { id: 'Train', label: 'Train' },
                        { id: 'Taxi', label: 'Taxi' },
                        { id: 'Car', label: 'Car' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setCalcTransport(t.id)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                            calcTransport === t.id
                              ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-50 dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.04] text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flat costs output grid */}
            <div className="grid grid-cols-5 gap-2 pt-5 border-t border-slate-100 dark:border-white/[0.03]">
              <div className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.03] rounded-2xl text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Flights</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block mt-1">${budgetBreakdown.flights}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.03] rounded-2xl text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Hotels</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block mt-1">${budgetBreakdown.hotels}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.03] rounded-2xl text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Food</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block mt-1">${budgetBreakdown.food}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.03] rounded-2xl text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Commute</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block mt-1">${budgetBreakdown.transport}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.03] rounded-2xl text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Visas</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block mt-1">${budgetBreakdown.visa}</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box & SVG Pie Chart (Right side) */}
          <div className="lg:col-span-5 premium-glass-card p-6 sm:p-8 rounded-[28px] text-center space-y-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Total Estimated Cost</span>
              <span className="font-heading text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                ${budgetBreakdown.total.toLocaleString()}
              </span>
              <div className="flex items-center justify-center gap-4 mt-2.5 text-xs font-mono font-bold text-slate-400">
                <span>Avg Daily: ${budgetBreakdown.daily}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Per Pilgrim: ${budgetBreakdown.perPerson}</span>
              </div>
            </div>

            {/* SVG Pie Chart */}
            <div className="flex justify-center items-center py-2 select-none relative animate-scale-in">
              <svg width="180" height="180" viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E6E8EA" strokeWidth="3" />
                
                {/* Flights portion */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="transparent" 
                  stroke="#10B981" 
                  strokeWidth="3.2" 
                  strokeDasharray={`${(budgetBreakdown.flights / budgetBreakdown.total) * 100} ${100 - (budgetBreakdown.flights / budgetBreakdown.total) * 100}`} 
                  strokeDashoffset="0" 
                />

                {/* Hotel portion */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="transparent" 
                  stroke="#3B82F6" 
                  strokeWidth="3.2" 
                  strokeDasharray={`${(budgetBreakdown.hotels / budgetBreakdown.total) * 100} ${100 - (budgetBreakdown.hotels / budgetBreakdown.total) * 100}`} 
                  strokeDashoffset={-((budgetBreakdown.flights / budgetBreakdown.total) * 100)} 
                />

                {/* Food portion */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="transparent" 
                  stroke="#F59E0B" 
                  strokeWidth="3.2" 
                  strokeDasharray={`${(budgetBreakdown.food / budgetBreakdown.total) * 100} ${100 - (budgetBreakdown.food / budgetBreakdown.total) * 100}`} 
                  strokeDashoffset={-(((budgetBreakdown.flights + budgetBreakdown.hotels) / budgetBreakdown.total) * 100)} 
                />

                {/* Transport portion */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="transparent" 
                  stroke="#EC4899" 
                  strokeWidth="3.2" 
                  strokeDasharray={`${(budgetBreakdown.transport / budgetBreakdown.total) * 100} ${100 - (budgetBreakdown.transport / budgetBreakdown.total) * 100}`} 
                  strokeDashoffset={-(((budgetBreakdown.flights + budgetBreakdown.hotels + budgetBreakdown.food) / budgetBreakdown.total) * 100)} 
                />

                {/* Visa portion */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="transparent" 
                  stroke="#8B5CF6" 
                  strokeWidth="3.2" 
                  strokeDasharray={`${(budgetBreakdown.visa / budgetBreakdown.total) * 100} ${100 - (budgetBreakdown.visa / budgetBreakdown.total) * 100}`} 
                  strokeDashoffset={-(((budgetBreakdown.flights + budgetBreakdown.hotels + budgetBreakdown.food + budgetBreakdown.transport) / budgetBreakdown.total) * 100)} 
                />
              </svg>
              {/* Central text overlay */}
              <div className="absolute text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block font-light">Breakdown</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white block font-mono">Umrah</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-3 gap-2 text-[9px] font-bold uppercase tracking-wider font-mono text-slate-400 border-t border-slate-100 dark:border-white/[0.03] pt-4">
              <span className="flex items-center justify-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Flights</span>
              <span className="flex items-center justify-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Lodging</span>
              <span className="flex items-center justify-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Food</span>
              <span className="flex items-center justify-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500 inline-block" /> Commute</span>
              <span className="flex items-center justify-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Visa</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DAYS CALCULATOR & RECOMMEND ITINERARY */}
      <div id="itinerary-generator" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-left overflow-hidden">
        {/* Decorative SVG Vector Elements — Travel Route Map and Compass */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Subtle Pilgrimage Route Map with Location Markers (Makkah -> Mina -> Muzdalifah -> Arafat -> Madinah) */}
          <svg className="absolute top-12 left-12 w-full max-w-lg h-64 text-emerald-600/[0.04] dark:text-emerald-400/[0.06]" viewBox="0 0 400 200" fill="none" stroke="currentColor">
            {/* Animated Curved Dotted Travel Path */}
            <path 
              d="M50,150 Q100,50 170,100 T300,80 T350,120" 
              strokeWidth="1.2" 
              strokeDasharray="4 6" 
              style={{ strokeDashoffset: 100, animation: 'stroke-dash-scroll 30s linear infinite' }}
            />
            
            {/* Makkah Marker */}
            <circle cx="50" cy="150" r="4" fill="currentColor" />
            <text x="35" y="165" fill="currentColor" className="text-[8px] font-bold font-mono">Makkah</text>
            
            {/* Mina Marker */}
            <circle cx="120" cy="85" r="3" fill="currentColor" />
            <text x="108" y="75" fill="currentColor" className="text-[8px] font-bold font-mono">Mina</text>
            
            {/* Muzdalifah Marker */}
            <circle cx="190" cy="98" r="3" fill="currentColor" />
            <text x="175" y="112" fill="currentColor" className="text-[8px] font-bold font-mono">Muzdalifah</text>
            
            {/* Arafat Marker */}
            <circle cx="260" cy="86" r="3" fill="currentColor" />
            <text x="245" y="75" fill="currentColor" className="text-[8px] font-bold font-mono">Arafat</text>
            
            {/* Madinah Marker */}
            <circle cx="350" cy="120" r="4" fill="currentColor" />
            <text x="335" y="135" fill="currentColor" className="text-[8px] font-bold font-mono">Madinah</text>
          </svg>

          {/* Detailed Compass Design in Top Right Corner */}
          <svg className="absolute -top-6 -right-6 w-72 h-72 text-amber-500/[0.04] dark:text-amber-400/[0.06] animate-[spin_180s_linear_infinite]" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="85" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="80" strokeWidth="0.4" strokeDasharray="2 3" />
            <circle cx="100" cy="100" r="70" strokeWidth="0.3" strokeDasharray="6 2" />
            <circle cx="100" cy="100" r="45" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="10" strokeWidth="0.5" strokeDasharray="1 1" />
            
            {/* Compass rose points */}
            <path d="M100,15 L105,95 L100,100 L95,95 Z" fill="currentColor" opacity="0.6" />
            <path d="M100,185 L105,105 L100,100 L95,105 Z" fill="currentColor" opacity="0.2" />
            <path d="M15,100 L95,105 L100,100 L95,95 Z" fill="currentColor" opacity="0.4" />
            <path d="M185,100 L105,105 L100,100 L105,95 Z" fill="currentColor" opacity="0.2" />
            
            <text x="97" y="12" fill="currentColor" className="text-[9px] font-bold font-mono">N</text>
            <text x="97" y="196" fill="currentColor" className="text-[9px] font-bold font-mono">S</text>
            <text x="6" y="103" fill="currentColor" className="text-[9px] font-bold font-mono">W</text>
            <text x="190" y="103" fill="currentColor" className="text-[9px] font-bold font-mono">E</text>
          </svg>

          {/* Thin flowing gold/emerald ribbons */}
          <svg className="absolute -bottom-10 right-24 w-80 h-40 text-emerald-500/[0.03] dark:text-emerald-400/[0.05] animate-pulse-subtle" viewBox="0 0 300 150" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M0,100 Q100,30 200,120 T300,50" />
            <path d="M0,110 Q100,40 200,130 T300,60" strokeWidth="0.4" strokeDasharray="4 4" />
          </svg>
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.25em] block font-mono">Custom Schedule</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight text-balance">
            Recommended Itinerary Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light font-body max-w-xl mx-auto text-pretty">
            Select your preferred duration and view a structured day-by-day plan of worship, travel, and historical tours.
          </p>
        </div>

        {/* Days selectors tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 select-none">
          {[3, 5, 7, 10, 14].map((days) => (
            <button
              key={days}
              onClick={() => setItineraryDays(days)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                itineraryDays === days
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#0c1938]/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {days} Days Itinerary
            </button>
          ))}
        </div>

        {/* Generated Timeline Grid */}
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
          {recommendedItinerary.map((item, idx) => (
            <div key={item.day} className="flex gap-4 sm:gap-6 relative">
              {/* Visual timeline line */}
              {idx !== recommendedItinerary.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200 dark:bg-white/[0.05]" />
              )}
              
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-heading text-base font-black shrink-0">
                D{item.day}
              </div>

              <div className="bg-white dark:bg-[#0c1938]/40 p-5 sm:p-6 rounded-3xl border border-slate-200/60 dark:border-white/[0.04] shadow-sm space-y-2 flex-1 text-left">
                <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light font-body leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. STEP-BY-STEP RITUAL TIMELINE ACCORDION GUIDE */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-left overflow-hidden">
        {/* Decorative SVG Vector Elements — Islamic Patterns & Kaaba Wireframe */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Huge Kaaba Wireframe Watermark (Center / slightly right, 2% opacity) */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-[450px] h-[450px] text-slate-800/[0.02] dark:text-white/[0.02] animate-float-slow" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
            {/* Kaaba Cube Outer Lines */}
            <path d="M50,80 L100,55 L150,80 L100,105 Z" />
            <path d="M50,80 L50,140 L100,165 L100,105 Z" />
            <path d="M150,80 L150,140 L100,165" />
            {/* Kiswa Belt Line */}
            <path d="M50,95 L100,70 L150,95" strokeDasharray="3 2" />
            {/* Door Outline */}
            <path d="M115,103 L115,140 L135,130 L135,93 Z" />
            {/* Pilgrims Radial Circles around Kaaba */}
            <circle cx="100" cy="110" r="75" strokeDasharray="6 8" strokeWidth="0.4" />
            <circle cx="100" cy="110" r="90" strokeDasharray="4 12" strokeWidth="0.3" />
          </svg>

          {/* Elegant Multi-layered Islamic Arch Outline in Corner */}
          <svg className="absolute -top-6 -left-6 w-80 h-80 text-emerald-600/[0.03] dark:text-emerald-450/[0.05] animate-pulse-subtle" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
            <path d="M10,90 L10,50 C10,20 50,5 50,5 C50,5 90,20 90,50 L90,90" />
            <path d="M15,90 L15,51 C15,23 50,8 50,8 C50,8 85,23 85,51 L85,90" strokeWidth="0.3" strokeDasharray="2 2" />
            <path d="M5,90 L5,49 C5,17 50,2 50,2 C50,2 95,17 95,49 L95,90" strokeWidth="0.2" opacity="0.5" />
          </svg>

          {/* Subtle Crescent & Star Outline (Single line, one corner only) */}
          <svg className="absolute top-10 right-10 w-24 h-24 text-amber-500/[0.03] dark:text-amber-450/[0.05] animate-float-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M60,20 A30,30 0 1,0 80,65 A24,24 0 1,1 60,20" />
            <polygon points="65,40 67,46 73,46 68,50 70,56 65,52 60,56 62,50 57,46 63,46" fill="currentColor" opacity="0.4" />
          </svg>

          {/* Hexagonal Islamic Mashrabiya Pattern in Bottom Left */}
          <svg className="absolute -bottom-12 -left-12 w-64 h-64 text-emerald-500/[0.02] dark:text-emerald-400/[0.04]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4">
            <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" />
            <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="25" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <line x1="11" y1="27.5" x2="89" y2="72.5" />
            <line x1="11" y1="72.5" x2="89" y2="27.5" />
          </svg>

          {/* Soft Glass Glow backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.25em] block font-mono">Ritual Guide</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight text-balance">
            Step-by-Step Umrah Rituals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light font-body max-w-xl mx-auto text-pretty">
            A collapsible spiritual guide describing the obligations, sunnahs, and critical steps for a correct pilgrimage.
          </p>
        </div>

        {/* 9 Major Steps Accordion Timeline (Unified premium container card) */}
        <div className="max-w-3xl mx-auto premium-glass-card p-4 sm:p-6 rounded-3xl space-y-2">
          {[
            {
              step: 1,
              title: "What is Umrah",
              desc: "Umrah is an act of deep worship that purifies the soul and removes sins. It can be performed in under 3 hours and is composed of four pillars: Ihram, Tawaf, Sa'i, and shaving/cutting hair.",
              sunnah: ["Niyyah (intention)", "Reciting Talbiyah frequently", "Entering Haram with right foot"],
              mistakes: ["Thinking it requires Hajj permissions", "Performing it without basic knowledge of steps"],
              tips: "Read books or watch walkthroughs of the Haram layout before boarding."
            },
            {
              step: 2,
              title: "Preparing for Umrah",
              desc: "Includes physical preparation, cleaning body parts, clipping nails, taking a ghusl (purifying bath), and planning the Miqat transition point.",
              sunnah: ["Trimming mustache", "Shaving underarms and pubic hair", "Ghusl before putting on Ihram"],
              mistakes: ["Putting on Ihram sheets without cleaning oneself", "Forgetting anti-chafing ointment (essential for men)"],
              tips: "Pack fragrance-free soap, anti-chafing vaseline, and slip-on sandals."
            },
            {
              step: 3,
              title: "Entering Ihram",
              desc: "Dressing in Ihram sheets (men) or modest loose clothes (women) and declaring the spiritual intention at or before crossing the designated Miqat boundaries.",
              sunnah: ["Offering two rak’ahs after dressing", "Declaring intention verbally: 'Labbayka Umrah'"],
              mistakes: ["Crossing the Miqat boundary in flight without putting on Ihram sheets", "Applying perfume after declaring the intention"],
              tips: "If traveling by air, put on the Ihram sheets at your home airport or inside the airplane restroom 1 hour before the pilot announces the Miqat boundary."
            },
            {
              step: 4,
              title: "The Talbiyah",
              desc: "Continuously reciting the Talbiyah out loud (men) or silently (women) from the moment of entering Ihram until reaching the Mataf area to begin Tawaf.",
              sunnah: ["Raising voice (men only)", "Reciting with devotion and contemplating its meaning"],
              mistakes: ["Staying quiet during transit", "Using chanting groups that shout in unison awkwardly"],
              tips: "Keep your tongue moist with Talbiyah. It is the announcement of your response to the call of Allah."
            },
            {
              step: 5,
              title: "Arrival in Makkah",
              desc: "Checking into your hotel, placing luggage safely, making fresh wudu, and proceeding directly to Masjid al-Haram with calm reverence.",
              sunnah: ["Entering through Bab al-Salam if possible", "Entering with right foot and reciting Haram entry du'a"],
              mistakes: ["Rushing to the Mataf instantly without resting, causing physical fatigue and confusion"],
              tips: "Rest for 1-2 hours in your hotel room after travel before attempting the Umrah rituals to ensure peak energy."
            },
            {
              step: 6,
              title: "Tawaf of Kaaba",
              desc: "Circumambulating the Kaaba seven times in a counter-clockwise direction, starting and ending at the Black Stone line.",
              sunnah: ["Idtiba (uncovering right shoulder for men)", "Ramal (jogging for men in first 3 rounds)", "Reciting recommended prayers between Yemeni Corner and Black Stone"],
              mistakes: ["Pushing people aggressively", "Uncovering the right shoulder during prayers (it is only for Tawaf)", "Stopping to take selfies facing the Kaaba during Tawaf rounds"],
              tips: "Walk in the outer circle if the Mataf ground level is congested. It takes longer but is safer and less stressful."
            },
            {
              step: 7,
              title: "Performing Sa’i",
              desc: "Walking seven times between the hills of Safa and Marwah inside Masjid al-Haram, commemorating Hajar's struggle.",
              sunnah: ["Running lightly between the green fluorescent light markers (men only)", "Making long sincere du'as facing the Kaaba at Safa and Marwah"],
              mistakes: ["Walking 14 times (thinking Safa to Marwah is one round instead of Safa to Marwah being D1, Marwah to Safa D2)"],
              tips: "Stay hydrated. Zamzam water stations are abundant along the Sa'i walkway. Take your time."
            },
            {
              step: 8,
              title: "Halq or Taqsir",
              desc: "Shaving the entire head (men, highly recommended) or cutting at least one inch from all sides of the hair (women and men).",
              sunnah: ["Shaving the head completely (Halq) rather than trim"],
              mistakes: ["Women shaving their heads (strictly forbidden)", "Cutting hair inside Masjid al-Haram itself, causing hair littering (illegal and unsanitary)"],
              tips: "Use licensed barbers located outside the Haram tunnels. They use hygienic single-use blades."
            },
            {
              step: 9,
              title: "Completion of Umrah",
              desc: "Once the hair is cut/shaved, all Ihram restrictions are immediately lifted, and you can put on normal clothes.",
              sunnah: ["Expressing gratitude with charity", "Focusing on extra prayers in Makkah"],
              mistakes: ["Violating Ihram taboos before the hair is actually cut"],
              tips: "Congratulations! Take a long rest and focus on performing your daily prayers in congregation inside Masjid al-Haram."
            }
          ].map((item) => (
            <div key={item.step} className="border-b border-slate-100 dark:border-white/[0.03] last:border-0">
              <button
                onClick={() => setOpenRitualStep(openRitualStep === item.step ? 0 : item.step)}
                aria-expanded={openRitualStep === item.step}
                aria-controls={`ritual-step-${item.step}`}
                className="w-full py-4 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all select-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 text-balance">{item.title}</h3>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${openRitualStep === item.step ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>

              <div 
                id={`ritual-step-${item.step}`}
                role="region"
                className={`transition-all duration-300 overflow-hidden ${
                  openRitualStep === item.step ? 'max-h-[600px] pb-5' : 'max-h-0'
                }`}
              >
                <div className="pl-10 pr-4 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed text-pretty">{item.desc}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-white/[0.03] text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono block">Sunnah practices</span>
                      <ul className="list-disc pl-4 space-y-1 font-light text-slate-500 dark:text-slate-400 leading-normal">
                        {item.sunnah.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest font-mono block">Common mistakes</span>
                      <ul className="list-disc pl-4 space-y-1 font-light text-slate-500 dark:text-slate-400 leading-normal">
                        {item.mistakes.map((m, idx) => <li key={idx}>{m}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono block">Important tips</span>
                      <p className="font-light text-[#475569] dark:text-slate-400 leading-relaxed text-pretty">{item.tips}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. FIRST-TIME PILGRIM HANDBOOK (Visual staging workflow) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-left font-body overflow-hidden">
        {/* Section Background Decoration */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Blueprint Grid (like Figma canvas, extremely subtle) */}
          <svg className="absolute inset-0 w-full h-full text-slate-800/[0.015] dark:text-white/[0.015]" width="100%" height="100%">
            <defs>
              <pattern id="handbook-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#handbook-grid)" />
          </svg>

          {/* Timeline progress line connectors */}
          <svg className="absolute top-[210px] left-[15%] right-[15%] w-[70%] h-4 text-emerald-500/[0.08] dark:text-emerald-400/[0.12] hidden md:block" viewBox="0 0 100 10" fill="none" stroke="currentColor">
            <line x1="0" y1="5" x2="100" y2="5" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points="100,5 95,2 95,8" fill="currentColor" />
          </svg>

          {/* Flowing ribbon curve crossing the handbook section */}
          <svg className="absolute top-1/4 -right-10 w-96 h-48 text-amber-500/[0.03] dark:text-amber-400/[0.05] animate-pulse-subtle" viewBox="0 0 300 150" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M300,50 Q200,120 100,30 T0,100" />
            <path d="M300,60 Q200,130 100,40 T0,110" strokeWidth="0.4" strokeDasharray="3 3" />
          </svg>

          {/* Floating soft dots */}
          <svg className="absolute top-[10%] left-[8%] w-4 h-4 text-emerald-500/10 animate-float-slow" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="3" /></svg>
          <svg className="absolute bottom-[20%] right-[8%] w-5 h-5 text-amber-500/10 animate-float-slow" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="4" /></svg>
          <svg className="absolute top-[40%] right-[15%] w-3 h-3 text-emerald-500/10 animate-float-slow" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="2" /></svg>

          {/* Soft Glass Glow behind the three cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-emerald-500/[0.015] dark:bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-[0.25em] block font-mono">Pilgrim Handbook</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight text-balance">
            First-Time Pilgrim Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto text-pretty">
            A comprehensive roadmap detailing transit, airports, checkpoints, immigration, and hotel arrival procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1 */}
          <div className="premium-glass-card p-6 rounded-3xl relative space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">STAGE 01</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center"><PlaneTakeoff size={16} /></div>
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Departure & Miqat Protocol</h3>
            <div className="text-xs font-light text-slate-500 dark:text-slate-400 space-y-3.5 leading-relaxed border-t border-slate-100 dark:border-white/[0.03] pt-4">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <p><strong>Documents:</strong> Verify your visa printout, medical vaccination paper, passport, and Nusuk slot registration are ready.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <p><strong>Ihram Attire:</strong> Men must put on the unstitched sheets at the home airport or on the flight 1 hour prior to crossing the Miqat.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                <p><strong>Niyyah declaration:</strong> Verbally recite <em>"Labbayk Allahumma Umrah"</em> immediately when the flight crew announces the Miqat line.</p>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="premium-glass-card p-6 rounded-3xl relative space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">STAGE 02</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center"><Fingerprint size={16} /></div>
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Arrival & Immigration</h3>
            <div className="text-xs font-light text-slate-500 dark:text-slate-400 space-y-3.5 leading-relaxed border-t border-slate-100 dark:border-white/[0.03] pt-4">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <p><strong>Landing Station:</strong> Landing will be at <strong>Jeddah (JED)</strong> or <strong>Madinah (MED)</strong>. Makkah itself has no airport facility.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <p><strong>Biometric Scan:</strong> Settle through arrivals by providing digital fingerprints, validating visas, and confirming Nusuk records.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                <p><strong>Local SIM:</strong> Purchase a local Zain/STC/Mobily data card right inside airport exit gates to ensure active internet.</p>
              </div>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="premium-glass-card p-6 rounded-3xl relative space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">STAGE 03</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center"><Train size={16} /></div>
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Transit & Settlement</h3>
            <div className="text-xs font-light text-slate-500 dark:text-slate-400 space-y-3.5 leading-relaxed border-t border-slate-100 dark:border-white/[0.03] pt-4">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <p><strong>High-Speed Rail:</strong> Walk to the airport rail station. Board the Haramain high speed train (35 mins travel directly to Makkah station).</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <p><strong>Taxis & Cabs:</strong> Airport taxis cost 150-250 SAR. Negotiate or pre-book online. SAPTCO buses offer budget transfers.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                <p><strong>Hotel Check-In:</strong> Store your suitcases, rest for an hour, perform a fresh wudu, and head to Masjid al-Haram to perform Tawaf.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prohibitions Card Section (Warn panel grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-left">
        <div className="bg-rose-50 dark:bg-red-950/10 p-6 sm:p-8 rounded-[28px] border border-rose-200/50 dark:border-red-500/15 space-y-5">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm uppercase tracking-wider font-mono">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Ihram Prohibited Acts (Taboos)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
            While in the state of Ihram, the following acts are strictly prohibited under Islamic law. Committing them requires penalty (Fidyah) if done intentionally.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { title: "Grooming", desc: "No clipping nails, shaving, or cutting body hair.", icon: <Scissors size={14} className="text-rose-500" /> },
              { title: "Scented Products", desc: "No perfumed soap, shampoo, cologne, or scented wipes.", icon: <Ban size={14} className="text-rose-500" /> },
              { title: "Head Covers (Men)", desc: "Men must not cover their head with caps or hoods.", icon: <Shield size={14} className="text-rose-500" /> },
              { title: "Stitched Clothes (Men)", desc: "Men must wear only unstitched Ihram wrap sheets.", icon: <Activity size={14} className="text-rose-500" /> },
              { title: "Face Cover (Women)", desc: "Women must keep their faces fully uncovered.", icon: <User size={14} className="text-rose-500" /> },
              { title: "Nature Protection", desc: "No hunting animals or cutting trees within Haram.", icon: <Compass size={14} className="text-rose-500" /> },
              { title: "Intimacy", desc: "No marital relations, marriage proposals, or intimate talks.", icon: <Heart size={14} className="text-rose-500" /> },
              { title: "General Sins", desc: "No arguing, fighting, or using abusive language.", icon: <AlertCircle size={14} className="text-rose-500" /> }
            ].map((p, idx) => (
              <div key={idx} className="p-4 bg-white/70 dark:bg-red-950/20 border border-rose-200/50 dark:border-red-500/10 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5">
                  {p.icon}
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-450 font-body">{p.title}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-300 block font-body leading-relaxed">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. PLACES TO VISIT IN MAKKAH & MADINAH (ZIYARAT) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-left overflow-hidden">
        {/* Section Background Decoration */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Abstract Mosque Skyline illustration (Single stroke, bottom right) */}
          <svg className="absolute -bottom-4 right-0 w-96 h-36 text-emerald-600/[0.04] dark:text-emerald-400/[0.06]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M10,80 L10,60 C10,60 15,40 25,40 C35,40 40,60 40,60 L40,80 M40,80 L40,45 C40,45 48,25 60,25 C72,25 80,45 80,45 L80,80 M80,80 L80,30 L85,20 L90,30 L90,80 M90,80 L90,55 C90,55 95,35 105,35 C115,35 120,55 120,55 L120,80 M120,80 L120,50 L122,10 L124,50 L124,80 M124,80 L130,70 L140,80 M140,80 L140,55 C140,55 145,35 155,35 C165,35 170,55 170,55 L170,80" />
            {/* Added extra minarets & crescent on top of dome */}
            <path d="M60,25 L60,18" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="60" cy="18" r="1.5" fill="currentColor" />
            <path d="M105,35 L105,28" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="105" cy="28" r="1.2" fill="currentColor" />
          </svg>

          {/* Topographic travel contour lines (top left) */}
          <svg className="absolute top-4 left-4 w-72 h-72 text-amber-500/[0.03] dark:text-amber-400/[0.05]" viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M0,50 C100,10 150,120 300,50" />
            <path d="M0,80 C110,40 160,150 300,80" strokeDasharray="3 3" />
            <path d="M0,110 C120,70 170,180 300,110" />
            <path d="M0,140 C130,100 180,210 300,140" strokeDasharray="2 2" />
          </svg>

          {/* Crescent & Star Outline (Top Right) */}
          <svg className="absolute top-12 right-12 w-16 h-16 text-emerald-500/[0.03] dark:text-emerald-450/[0.05]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M50,30 A20,20 0 1,0 65,65 A16,16 0 1,1 50,30" />
            <polygon points="55,42 56,46 60,46 57,49 58,53 55,50 52,53 53,49 50,46 54,46" fill="currentColor" />
          </svg>

          {/* Floating soft dots */}
          <svg className="absolute top-1/4 left-1/3 w-3 h-3 text-emerald-500/10 animate-float-slow" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="2.5" /></svg>
          <svg className="absolute bottom-1/3 right-1/4 w-4 h-4 text-amber-500/10 animate-float-slow" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="3.5" /></svg>

          {/* Soft Glass Glow behind Ziyarat Grid */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-[0.25em] block font-mono">Holy Landmarks</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight text-balance">
            Places to Visit (Ziyarat)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light font-body max-w-xl mx-auto text-pretty">
            Explore the historical battlefields, sacred sanctuaries, and mountaintop caves that shaped the history of Islam.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-6 select-none">
          <button
            onClick={() => {
              setActiveTab('makkah');
              setActiveSubCategory('All');
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'makkah'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-[#0c1938]/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] hover:bg-slate-100'
            }`}
          >
            Makkah Ziyarat ({MAKKAH_ATTRACTIONS.length})
          </button>
          
          <button
            onClick={() => {
              setActiveTab('madinah');
              setActiveSubCategory('All');
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'madinah'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-[#0c1938]/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] hover:bg-slate-100'
            }`}
          >
            Madinah Ziyarat ({MADINAH_ATTRACTIONS.length})
          </button>
        </div>

        {/* Sub-category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 select-none max-w-5xl mx-auto">
          {['All', ...new Set((activeTab === 'makkah' ? MAKKAH_ATTRACTIONS : MADINAH_ATTRACTIONS).map(place => place.category))].map((subCat) => (
            <button
              key={subCat}
              onClick={() => setActiveSubCategory(subCat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                activeSubCategory === subCat
                  ? 'bg-[#10B981] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.06]'
              }`}
            >
              {subCat}
            </button>
          ))}
        </div>

        {/* Grid of Ziyarat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in font-body">
          {(activeTab === 'makkah' ? MAKKAH_ATTRACTIONS : MADINAH_ATTRACTIONS)
            .filter(place => activeSubCategory === 'All' || place.category === activeSubCategory)
            .map((place) => (
              <div 
                key={place.name}
                className="group premium-glass-card overflow-hidden relative flex flex-col justify-between rounded-3xl"
              >
                {/* Image container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-dark-300">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    {(() => {
                      const style = CATEGORY_STYLES[place.category] || {
                        icon: MapPin,
                        bg: 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/20',
                        text: 'text-slate-700 dark:text-slate-300'
                      };
                      const IconComponent = style.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${style.bg} ${style.text} text-[9px] font-bold tracking-wider uppercase font-body mb-2`}>
                          <IconComponent className="w-3.5 h-3.5" />
                          {place.category}
                        </span>
                      );
                    })()}
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{place.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 font-light leading-relaxed font-body">{place.description}</p>
                    
                    <div className="space-y-1.5 text-[11px] font-light pt-2.5 border-t border-slate-100 dark:border-white/[0.03]">
                      <p className="text-slate-500 dark:text-slate-400"><strong className="text-slate-700 dark:text-slate-200">History: </strong> {place.history}</p>
                      <p className="text-slate-500 dark:text-slate-400"><strong className="text-slate-700 dark:text-slate-200">Visiting Tips: </strong> {place.tips}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#10B981]" /> {place.coords}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Dynamic YouTube Travel & Ziyarat Section */}
        <div className="pt-12">
          <YouTubeTravelSection 
            destination={activeTab === 'makkah' ? 'Makkah' : 'Madinah'} 
            category="religious"
            title={activeTab === 'makkah' ? '▶️ Sacred Makkah & Kaaba 4K Experience' : '▶️ Sacred Madinah & Prophet\'s Mosque 4K Experience'}
            subtitle={`Watch verified 4K walking tours, educational guides, and spiritual highlights of sacred sites in ${activeTab === 'makkah' ? 'Makkah al-Mukarramah' : 'Madinah al-Munawwarah'}.`}
          />
        </div>
      </div>

      {/* 9. PACKING CHECKLIST SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-left overflow-hidden">
        {/* Section Background Decoration */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Figma-like Blueprint Grid lines */}
          <svg className="absolute -bottom-16 -right-16 w-80 h-80 text-emerald-500/[0.03] dark:text-emerald-400/[0.05]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
            <g>
              <line x1="0" y1="20" x2="200" y2="20" />
              <line x1="0" y1="40" x2="200" y2="40" />
              <line x1="0" y1="60" x2="200" y2="60" />
              <line x1="0" y1="80" x2="200" y2="80" />
              <line x1="0" y1="100" x2="200" y2="100" />
              <line x1="0" y1="120" x2="200" y2="120" />
              <line x1="0" y1="140" x2="200" y2="140" />
              <line x1="0" y1="160" x2="200" y2="160" />
              <line x1="0" y1="180" x2="200" y2="180" />
              <line x1="20" y1="0" x2="20" y2="200" />
              <line x1="40" y1="0" x2="40" y2="200" />
              <line x1="60" y1="0" x2="60" y2="200" />
              <line x1="80" y1="0" x2="80" y2="200" />
              <line x1="100" y1="0" x2="100" y2="200" />
              <line x1="120" y1="0" x2="120" y2="200" />
              <line x1="140" y1="0" x2="140" y2="200" />
              <line x1="160" y1="0" x2="160" y2="200" />
              <line x1="180" y1="0" x2="180" y2="200" />
            </g>
          </svg>

          {/* Diagonal Tasbeeh Prayer Bead String Pattern */}
          <svg className="absolute -top-10 left-12 w-64 h-64 text-emerald-500/[0.04] dark:text-emerald-450/[0.06] animate-pulse-subtle" viewBox="0 0 200 200" fill="none">
            {/* Bead line */}
            <path d="M200,10 L10,180" stroke="currentColor" strokeWidth="2.5" strokeDasharray="1 8" strokeLinecap="round" />
            <path d="M200,18 L18,188" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1 6" strokeLinecap="round" opacity="0.5" />
          </svg>

          {/* Thin flowing gold/emerald ribbons */}
          <svg className="absolute top-10 right-10 w-64 h-48 text-amber-500/[0.04] dark:text-amber-400/[0.06]" viewBox="0 0 300 200" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M10,10 C100,90 200,40 290,190" />
            <path d="M20,10 C110,90 210,40 300,190" strokeWidth="0.4" strokeDasharray="3 3" />
          </svg>

          {/* Soft Glass Glow behind Checklist categories and lists */}
          <div className="absolute top-1/2 left-10 w-[280px] h-[280px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-12 right-12 w-[340px] h-[340px] bg-amber-500/[0.02] dark:bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Header & Categories Selector */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-[0.25em] block font-mono">Travel Gear</span>
              <h3 className="text-2xl sm:text-3.5xl font-bold text-slate-800 dark:text-white leading-tight">Pilgrim Packing Checklist</h3>
              <p className="text-xs text-slate-400 font-light mt-1 font-body">An interactive helper to ensure you carry all required documents, unstitched clothing sheets, and medication.</p>
            </div>

            {/* Total progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-slate-400 uppercase tracking-wider">Total Packing Progress</span>
                <span className="text-emerald-500 font-bold">{totalChecklistProgress}% Done</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-white/[0.05] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                  style={{ width: `${totalChecklistProgress}%` }}
                />
              </div>
            </div>

            {/* Selector Buttons */}
            <div className="flex flex-col gap-2 select-none font-body">
              {Object.keys(CHECKLIST_SECTIONS).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveChecklist(cat)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-left transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                    activeChecklist === cat
                      ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-450 scale-[1.02] shadow-sm'
                      : 'bg-white dark:bg-[#0c1938]/40 text-slate-500 dark:text-slate-300 border-slate-200/60 dark:border-white/[0.05] hover:bg-slate-100'
                  }`}
                >
                  <span className="capitalize">{cat}</span>
                  <span className="text-[10px] bg-slate-150 dark:bg-white/[0.05] px-2 py-0.5 rounded-full font-mono text-slate-400">
                    {calculateChecklistProgress(cat)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Checklist entries (Right side) */}
          <div className="lg:col-span-8 premium-glass-card p-6 sm:p-8 rounded-[28px] min-h-[360px] flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-lg font-bold capitalize text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/[0.03] pb-3 font-sans">
                {activeChecklist} essentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(CHECKLIST_SECTIONS[activeChecklist] || []).map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      checkedItems[item.id]
                        ? 'bg-emerald-600/[0.03] border-emerald-500/30 text-slate-400 line-through opacity-85'
                        : 'bg-slate-50 dark:bg-white/[0.01] border-slate-200/50 dark:border-white/[0.03] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer accent-emerald-500"
                    />
                    <span className="text-xs sm:text-sm font-body leading-tight">{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const items = CHECKLIST_SECTIONS[activeChecklist] || [];
                const allChecked = items.every(item => checkedItems[item.id]);
                const updated = { ...checkedItems };
                items.forEach(item => {
                  updated[item.id] = !allChecked;
                });
                setCheckedItems(updated);
              }}
              className="mt-6 self-start text-xs text-emerald-500 font-bold hover:underline select-none font-body cursor-pointer"
            >
              { (CHECKLIST_SECTIONS[activeChecklist] || []).every(item => checkedItems[item.id]) ? 'Uncheck All in Section' : 'Mark Section as Complete' }
            </button>
          </div>
        </div>
      </div>

      {/* 10. FAQ ACCORDION SECTION (50 FAQs) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-left font-sans overflow-hidden">
        {/* Decorative SVG Vector Elements — Q&A Visual Motifs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
          {/* Detailed Islamic Octagonal Mashrabiya Grid (Top Right) */}
          <svg className="absolute -top-12 -right-12 w-80 h-80 text-emerald-500/[0.03] dark:text-emerald-400/[0.05] animate-pulse-subtle" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4">
            <pattern id="faq-mashrabiya" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="20" />
              <path d="M10,0 L20,10 L10,20 L0,10 Z M5,5 L15,5 L15,15 L5,15 Z" strokeWidth="0.2" />
              <circle cx="10" cy="10" r="1.5" strokeWidth="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#faq-mashrabiya)" />
          </svg>

          {/* Left-side flowing accent curves (Apple style) */}
          <svg className="absolute top-1/4 -left-8 w-80 h-[500px] text-amber-500/[0.04] dark:text-amber-400/[0.06] animate-pulse-subtle" viewBox="0 0 200 400" fill="none">
            <path d="M0,0 Q100,100 50,200 T0,400" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M20,0 Q120,100 70,200 T20,400" stroke="currentColor" strokeWidth="0.8" strokeDasharray="5 8" fill="none" />
          </svg>

          {/* Crescent & Star Outline (Bottom Right) */}
          <svg className="absolute -bottom-6 -right-6 w-32 h-32 text-amber-500/[0.03] dark:text-amber-450/[0.05] animate-float-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M50,30 A20,20 0 1,0 65,65 A16,16 0 1,1 50,30" />
            <polygon points="55,42 56,46 60,46 57,49 58,53 55,50 52,53 53,49 50,46 54,46" fill="currentColor" />
          </svg>

          {/* Floating soft dots */}
          <svg className="absolute top-1/3 left-10 w-4 h-4 text-emerald-500/10 animate-float-slow" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="3.5" /></svg>
          <svg className="absolute bottom-[20%] right-12 w-3 h-3 text-amber-500/10 animate-float-slow" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="2" /></svg>

          {/* Soft Glass Glow behind FAQs list */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-[0.25em] block font-mono">FAQ Center</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light font-body max-w-xl mx-auto text-pretty">
            A comprehensive list of common questions about spiritual rituals, Ihram taboos, transportation, budgets, and visa rules.
          </p>
        </div>

        {/* Categories selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 select-none">
          {['all', 'rituals', 'ihram', 'logistics', 'budgets'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFaqCat(cat);
                setOpenFaqIndex(-1);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeFaqCat === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#0c1938]/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Questions' : 
               cat === 'rituals' ? 'Rituals & Rules' : 
               cat === 'ihram' ? 'Ihram & Restrictions' : 
               cat === 'logistics' ? 'Logistics & Travel' : 'Budgets & Practical'}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="max-w-3xl mx-auto space-y-3 font-body">
          {filteredFaqs.map((faq, idx) => (
            <div 
              key={idx}
              className="premium-glass-card rounded-2xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                aria-expanded={openFaqIndex === idx}
                aria-controls={`faq-answer-${idx}`}
                className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all select-none cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight text-balance">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${openFaqIndex === idx ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>
              
              <div 
                id={`faq-answer-${idx}`}
                role="region"
                className={`transition-all duration-300 overflow-hidden ${
                  openFaqIndex === idx ? 'max-h-96 border-t border-slate-100 dark:border-white/[0.03]' : 'max-h-0'
                }`}
              >
                <div className="p-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed text-pretty">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
