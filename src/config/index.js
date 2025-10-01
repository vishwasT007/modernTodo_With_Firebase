// Configuration file for environment variables
const config = {
  api: {
    baseURL:
      process.env.REACT_APP_API_BASE_URL ||
      'https://us-central1-mytodoapp2025.cloudfunctions.net/api',
    endpoints: {
      login: '/login',
      signup: '/signup',
      user: '/user',
      todos: '/todos',
      todo: '/todo',
    },
  },
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key-here",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  },
  app: {
    name: process.env.REACT_APP_APP_NAME || 'TodoApp Pro',
    version: process.env.REACT_APP_VERSION || '2.0.0',
    useFirebase: process.env.REACT_APP_USE_FIREBASE === 'true' || false,
  },
};

export default config;
