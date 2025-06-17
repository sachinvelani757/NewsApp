import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Chrome as Home, Bookmark } from 'lucide-react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import ArticleDetailScreen from './src/screens/ArticleDetailScreen';

// Types
export type RootStackParamList = {
    MainTabs: undefined;
    ArticleDetail: {
        article: {
            title: string;
            description: string;
            url: string;
            image_url: string;
            pubDate: string;
            source_name: string;
            content?: string;
        };
    };
};

export type TabParamList = {
    Home: undefined;
    Bookmarks: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#6B7280',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#E5E7EB',
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 64,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Home size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Bookmarks"
                component={BookmarksScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Bookmark size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainTabs" component={TabNavigator} />
                    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
