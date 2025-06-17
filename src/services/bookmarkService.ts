import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../types/news';

const BOOKMARK_KEY = 'bookmarked_articles';

export class BookmarkService {
  static async getBookmarks(): Promise<Article[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARK_KEY);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  static async addBookmark(article: Article): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const updatedBookmarks = [...bookmarks, article];
      await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  }

  static async removeBookmark(articleUrl: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const updatedBookmarks = bookmarks.filter(article => article.image_url !== articleUrl);
      await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  }

  static async isBookmarked(articleUrl: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(article => article.image_url === articleUrl);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }
}
