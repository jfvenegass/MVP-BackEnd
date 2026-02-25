export interface RobleInsertResponse<T> {
  inserted: T[];
  skipped: any[];
}

export interface RobleReadResponse<T> extends Array<T> {}