import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { Article } from '../types/news';
import { BookmarkService } from '../services/bookmarkService';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  onBookmarkChange?: () => void;
}

export default function ArticleCard({ article, onPress, onBookmarkChange }: ArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkBookmarkStatus().then(r => {});
  }, [article.image_url,isBookmarked]);

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
      onBookmarkChange?.();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        {article.image_url && (
          <Image
            source={{ uri: article.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {article.title}
            </Text>
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={toggleBookmark}
              activeOpacity={0.7}
            >
              <Bookmark
                size={20}
                color={isBookmarked ? '#3B82F6' : '#6B7280'}
                fill={isBookmarked ? '#3B82F6' : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {article.description && (
            <Text style={styles.description} numberOfLines={3}>
              {article.description}
            </Text>
          )}
          {/*<Text style={styles.date}>*/}
          {/*  {formatDate(article.publishedAt)}*/}
          {/*</Text>*/}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginRight:16
  },
  source: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookmarkButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
