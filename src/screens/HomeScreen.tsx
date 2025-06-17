import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Article } from '../types/news';
import { NewsService } from '../services/newsApi';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchNews().then(r => {});
  }, []);

  const fetchNews = async (isRefresh = false, page = 1) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setCurrentPage(1);
        setHasMoreData(true);
      } else if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const response = await NewsService.getTopHeadlines(page, PAGE_SIZE);

      if (isRefresh || page === 1) {
        setArticles(response.results);
      } else {
        setArticles(prev => [...prev, ...response.results]);
      }

      setTotalResults(response.totalResults);
      setCurrentPage(page);

      // Check if we have more data to load
      const totalPages = Math.ceil(response.totalResults / PAGE_SIZE);
      setHasMoreData(page < totalPages);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleArticlePress = (article: Article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const onRefresh = () => {
    fetchNews(true);
  };

  const loadMoreArticles = () => {
    if (!loadingMore && hasMoreData && articles.length > 0) {
      fetchNews(false, currentPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Article }) => (
    <ArticleCard
      article={item}
      onPress={() => handleArticlePress(item)}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text style={styles.footerText}>Loading more articles...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No articles found</Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading latest news..." />;
  }

  if (error && !refreshing && articles.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchNews()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Latest News</Text>
        <Text style={styles.headerSubtitle}>
          {totalResults > 0
            ? `${articles.length} of ${totalResults} articles`
            : 'Stay updated with the latest headlines'
          }
        </Text>
      </View>

      {error && articles.length > 0 && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            Failed to load more articles. Pull to refresh.
          </Text>
        </View>
      )}

      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.image_url}-${index}`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        contentContainerStyle={articles.length === 0 ? styles.emptyContainer : styles.listContainer}
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={10}
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
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  errorBannerText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
});
