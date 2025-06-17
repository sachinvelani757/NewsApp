import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BookmarkX } from 'lucide-react-native';
import { Article } from '../types/news';
import { BookmarkService } from '../services/bookmarkService';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { RootStackParamList } from '../../App';

type BookmarksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function BookmarksScreen() {
  const navigation = useNavigation<BookmarksScreenNavigationProp>();
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const bookmarkedArticles = await BookmarkService.getBookmarks();
      setBookmarks(bookmarkedArticles);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  const handleArticlePress = (article: Article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const handleBookmarkChange = () => {
    fetchBookmarks();
  };

  const renderItem = ({ item }: { item: Article }) => (
    <ArticleCard
      article={item}
      onPress={() => handleArticlePress(item)}
      onBookmarkChange={handleBookmarkChange}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <BookmarkX size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyDescription}>
        Start bookmarking articles from the home screen to see them here.
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading bookmarks..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <Text style={styles.headerSubtitle}>
          {bookmarks.length > 0
            ? `${bookmarks.length} saved article${bookmarks.length === 1 ? '' : 's'}`
            : 'Your saved articles will appear here'
          }
        </Text>
      </View>
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.image_url}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={bookmarks.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
