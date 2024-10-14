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

export interface ExpeditionTrack {
  file: string;
  columns: {
    latitude: string;
    longitude: string;
    datetime: string;
  }
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
  images?: string[];
  track?: ExpeditionTrack;
  fundings: string[];
  references: Reference[];
  instruments: Instrument[];
}

export interface ExpeditionStore {
  expeditions: string[];
}