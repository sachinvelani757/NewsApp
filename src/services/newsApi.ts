import { NewsResponse } from '../types/news';

const NEWS_API_KEY = 'pub_e095dbeaba084eefb186e27e44911d45';
const BASE_URL = 'https://newsdata.io/api/1/latest';

export class NewsService {
  static async getTopHeadlines(): Promise<NewsResponse> {
    try {

      // Real API call
      const url = `https://newsdata.io/api/1/latest?apikey=pub_e095dbeaba084eefb186e27e44911d45&q=gujarat`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news articles');
    }
  }
}
