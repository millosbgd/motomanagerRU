export interface CodebookEntry {
  id: number;
  entity: string;
  code: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateCodebookEntryRequest {
  entity: string;
  code: string;
  name: string;
  sortOrder: number;
}

export interface UpdateCodebookEntryRequest {
  code: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}
