export function toMaxDecimals(x: number | null, n: number): number | null {
  if (x === null) {
    return null;
  }
  return +x.toFixed(n);
}

export function toFixed(x: number | null, n: number): string | null {
  if (x === null) {
    return null;
  }
  return x.toFixed(n);
}

export function makeLiteralLabel(values: number[]): string {
  const last = values.pop();
  if (values.length === 0) {
    return last + '';
  }
  return values.join(', ') + ' and ' + last;
}

export function getSizeLabel(size: number | undefined) {
  if (size === undefined || isNaN(size)) {
    return '-';
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// Function to convert decimal degrees to DMS (Degrees, Minutes, Seconds)
export function toDMS(deg: number) {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const secFloat = (minFloat - m) * 60;
  const s = Math.round(secFloat);
  
  return `${d}° ${m}' ${s}"`;
}

// Function to convert decimal coordinates to a user-friendly format (DMS + N/S/E/W)
export function formatCoordinates(lat: number, lon: number) {
  const latDirection = lat >= 0 ? 'N' : 'S';
  const lonDirection = lon >= 0 ? 'E' : 'W';

  const latDMS = toDMS(Math.abs(lat)); // Get absolute value of latitude
  const lonDMS = toDMS(Math.abs(lon)); // Get absolute value of longitude

  return `${latDMS} ${latDirection}, ${lonDMS} ${lonDirection}`;
}