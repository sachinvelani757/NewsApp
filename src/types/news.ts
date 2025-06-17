export interface Article {
  title: string;
  description: string;
  url: string;
  image_url: string;
  pubDate: string;
  source_name: string;
  content?: string;
}

export interface NewsResponse {
  results: Article[];
  totalResults: number;
  status: string;
}
