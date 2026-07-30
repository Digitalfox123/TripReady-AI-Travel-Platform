/**
 * Raw response interface from REST Countries API v3.1
 */
export interface RawRestCountryResponse {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string;
  cca3: string;
  currencies?: Record<string, { name: string; symbol: string }>;
  capital?: string[];
  region: string;
  subregion?: string;
  languages?: Record<string, string>;
  latlng: [number, number];
  area: number;
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  car: {
    signs?: string[];
    side: 'left' | 'right';
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

/**
 * Parsed facts resolved from the REST Countries API
 */
export interface ParsedCountryFacts {
  name: string;
  officialName: string;
  flagEmoji: string;
  flagImgUrl: string;
  capital: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  languages: string;
  timezones: string;
  population: string;
  drivingSide: string;
  mapLink: string;
  area: string;
  cca2: string;
}

/**
 * Unified Country Intelligence layout model (integrating API facts & travel guides)
 */
export interface CountryIntelligence {
  id: string;
  name: string;
  flag: string;
  continent: string;
  overview: string;
  dataSource: 'api' | 'fallback';
  facts: ParsedCountryFacts;
  safety: {
    score: string;
    solo: string;
    family: string;
    women: string;
    scams: string;
  };
  visa: {
    status: string;
    processing: string;
    requirements: string[];
  };
  basics: {
    plug: string;
    emergency: string;
    timezone: string;
  };
  seasons: {
    peak: string;
    shoulder: string;
    budget: string;
    timeline: ('peak' | 'shoulder' | 'budget')[];
  };
  destinations: Array<{
    name: string;
    category: string;
    desc: string;
    stay: string;
    why: string;
  }>;
  attractions: Array<{
    name: string;
    fee: string;
    duration: string;
    season: string;
    rating: string;
    tip: string;
  }>;
  budget: {
    budgetDaily: string;
    midRangeDaily: string;
    luxuryDaily: string;
    snapshot: {
      hotel: string;
      food: string;
      transport: string;
      attraction: string;
    };
  };
  transport: Record<string, {
    cost: string;
    conv: string;
    rec: string;
  }>;
  weather: Array<{
    month: string;
    temp: string;
    rain: string;
    snow: string;
    crowd: 'High' | 'Medium' | 'Low';
    rating: string;
  }>;
  dining: {
    avgCost: string;
    streetFood: string;
    dietary: {
      halal: string;
      veg: string;
      vegan: string;
    };
    restaurantTip: string;
    safetyTip: string;
  };
  culture: {
    greetings: string;
    tipping: string;
    dressCode: string;
    publicBehavior: string;
    religion: string;
    photography: string;
    laws: string;
    avoid: string[];
    etiquetteTips: string;
  };
  connectivity: {
    speed: string;
    simProviders: string;
    esim: string;
    wifi: string;
    coverage: string;
    apps: string;
    payment: string;
  };
  readiness: {
    safety: number;
    affordability: number;
    accessibility: number;
    family: number;
    solo: number;
  };
  checklist: Array<{
    label: string;
    checked: boolean;
  }>;
  insights: {
    whyLove: string;
    mistakes: string;
    hiddenGems: string;
    secrets: string;
  };
}
