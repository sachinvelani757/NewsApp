declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_NEWS_API_KEY: string;
    }
  }
}

// Ensure this file is treated as a module
export {};