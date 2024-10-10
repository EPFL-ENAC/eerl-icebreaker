export interface Reference {
  citation: string;
  doi: string;
}

export interface Measures {
  name: string;
  description?: string;
  datasets?: string[];
}

export interface Instrument {
  name: string;
  description?: string;
  measures: Measures[];
}

export interface Expedition {
  name: string;
  acronym: string;
  objectives?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  platform?: string;
  start_location: [number, number];
  end_location?: [number, number];
  image?: string;
  fundings: string[];
  references: Reference[];
  instruments: Instrument[];
}

export interface ExpeditionStore {
  expeditions: Expedition[];
}