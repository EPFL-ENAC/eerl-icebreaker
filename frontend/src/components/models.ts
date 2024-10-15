export interface FileObject extends Blob {
  readonly size: number;
  readonly name: string;
  readonly path: string;
  readonly type: string;
}

export interface CsvLine {
  [key: string]: string | number;
}
export interface CsvParseCallback {
  (data: CsvLine[]): void;
}