export interface FileRef {
  name: string;
  path: string;
  size: number;
  alt_name?: string;
  alt_path?: string;
  alt_size?: number;
}

export interface Reference {
  citation: string;
  title?: string;
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

export interface Track {
  file: FileRef;
  columns: {
    latitude: string;
    longitude: string;
    timestamp: string;
  },
  color?: string;
  timestamp_format?: string;
}

export interface Funding {
  name: string;
  grant?: string;
  website?: string;
}

export interface Campaign {
  id: string;
  name: string;
  acronym: string;
  website?: string;
  type?: string;
  color?: string;
  objectives?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  platform?: string;
  start_location: [number, number];
  end_location?: [number, number];
  images?: FileRef[];
  track?: Track;
  fundings: Funding[];
  references: Reference[];
  instruments: Instrument[];
  offsetX?: number;
  offsetY?: number;
}

export interface CampaignStore {
  campaigns: string[];
}