import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, Bookmark, ExternalLink } from 'lucide-react-native';
import { BookmarkService } from '../services/bookmarkService';
import { RootStackParamList } from '../../App';

type ArticleDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ArticleDetail'>;
type ArticleDetailScreenRouteProp = RouteProp<RootStackParamList, 'ArticleDetail'>;

const { width } = Dimensions.get('window');

export default function ArticleDetailScreen() {
  const navigation = useNavigation<ArticleDetailScreenNavigationProp>();
  const route = useRoute<ArticleDetailScreenRouteProp>();
  const { article } = route.params;

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkBookmarkStatus().then(r => {});
  }, []);

  const checkBookmarkStatus = async () => {
    const bookmarked = await BookmarkService.isBookmarked(article.image_url);
    setIsBookmarked(bookmarked);
  };

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await BookmarkService.removeBookmark(article.image_url);
      } else {
        await BookmarkService.addBookmark(article);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleBookmark}
            activeOpacity={0.7}
          >
            <Bookmark
              size={24}
              color={isBookmarked ? '#3B82F6' : '#6B7280'}
              fill={isBookmarked ? '#3B82F6' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {article.image_url && (
          <Image
            source={{ uri: article.image_url }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <View style={styles.meta}>
            <Text style={styles.source}>{article.source_name}</Text>
            <Text style={styles.date}>
              {formatDate(article.pubDate)}
            </Text>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          {article.description && (
            <Text style={styles.description}>{article.description}</Text>
          )}

          {article.content && (
            <Text style={styles.articleContent}>
              {article.content.replace(/\[\+\d+ chars\]$/, '')}
            </Text>
          )}

          <TouchableOpacity
            style={styles.readMoreButton}
            activeOpacity={0.8}
          >
            <ExternalLink size={20} color="#3B82F6" />
            <Text style={styles.readMoreText}>Read Full Article</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: width,
    height: 250,
  },
  content: {
    padding: 20,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  source: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 32,
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#374151',
    lineHeight: 28,
    marginBottom: 20,
    fontWeight: '500',
  },
  articleContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 26,
    marginBottom: 24,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  readMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
