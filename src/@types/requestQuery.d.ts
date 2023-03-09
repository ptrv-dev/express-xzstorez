export interface productGetAllQuery {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}
