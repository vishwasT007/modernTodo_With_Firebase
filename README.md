# 🚀 React Todo App with Firebase

A modern, full-featured todo application built with React, TypeScript, and Firebase. This project demonstrates advanced React patterns, performance optimizations, and professional development practices.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-9.22.0-orange)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14.0-blue)
![Testing](https://img.shields.io/badge/Testing-Jest%20%7C%20RTL-green)

## ✨ Features

### 🎯 Core Functionality
- **CRUD Operations**: Create, read, update, and delete todos
- **Real-time Sync**: Live updates across devices using Firebase Firestore
- **User Authentication**: Secure login/register with Firebase Auth
- **Priority Management**: High, medium, and low priority levels
- **Due Dates**: Set and track todo deadlines
- **Search & Filter**: Find todos quickly with advanced filtering

### 🚀 Advanced Features
- **TypeScript**: Full type safety and better developer experience
- **Performance Optimized**: React.memo, useMemo, useCallback for optimal rendering
- **Custom Hooks**: Reusable logic with custom hooks
- **Error Boundaries**: Graceful error handling and recovery
- **PWA Support**: Installable app with offline capabilities
- **Responsive Design**: Mobile-first approach with Material-UI
- **Testing**: Comprehensive test coverage with Jest and React Testing Library

### 🎨 UI/UX Features
- **Modern Design**: Clean, intuitive interface with Material-UI
- **Dark/Light Theme**: Theme switching capability
- **Animations**: Smooth transitions and hover effects
- **Notifications**: Toast notifications for user feedback
- **Loading States**: Skeleton loaders and progress indicators
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library with hooks and context
- **TypeScript 5.9.2** - Type safety and better DX
- **Material-UI 5.14.0** - Component library and theming
- **React Router 6** - Client-side routing
- **Day.js** - Date manipulation and formatting

### Backend & Services
- **Firebase Auth** - User authentication and management
- **Firestore** - NoSQL database with real-time updates
- **Firebase Hosting** - Static site hosting

### Development Tools
- **Create React App** - Build tooling and development server
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project setup
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/react-todo-app-firebase.git
   cd react-todo-app-firebase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Copy your Firebase config to `src/firebase/config.js`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── __tests__/      # Component tests
│   ├── TodoCard.tsx    # Optimized todo card component
│   ├── TodoList.tsx    # Main todo list component
│   ├── ErrorBoundary.tsx # Error boundary component
│   └── ...
├── context/            # React Context providers
│   ├── AppContext.tsx  # Global app state
│   └── FirebaseContext.tsx # Firebase state
├── hooks/              # Custom React hooks
│   ├── useTodos.ts     # Todo management hook
│   ├── useLocalStorage.ts # Local storage hook
│   ├── useDebounce.ts  # Debounce hook
│   └── useAsync.ts     # Async operations hook
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── firebase/           # Firebase configuration and utilities
│   ├── config.js       # Firebase configuration
│   ├── auth.js         # Authentication functions
│   └── firestore.js    # Firestore operations
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── index.tsx           # App entry point
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- TodoList.test.tsx
```

### Test Coverage
- **Components**: Unit tests for all major components
- **Hooks**: Custom hook testing
- **Context**: State management testing
- **Utilities**: Helper function testing

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Other Platforms
- **Vercel**: `vercel --prod`
- **Netlify**: Connect your GitHub repository
- **AWS S3**: Upload build folder to S3 bucket

## 📱 PWA Features

This app is a Progressive Web App (PWA) with:
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Standalone app experience
- **Fast Loading**: Optimized for performance

## 🎯 Performance Optimizations

### React Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Memoizes expensive calculations
- **useCallback**: Memoizes event handlers
- **Code Splitting**: Lazy loading of components

### Bundle Optimizations
- **Tree Shaking**: Removes unused code
- **Minification**: Compressed JavaScript and CSS
- **Gzip Compression**: Reduced file sizes
- **Image Optimization**: Optimized assets

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
npm run lint       # Run ESLint
```

### Code Quality
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Husky**: Pre-commit hooks (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Firebase](https://firebase.google.com/) - Backend services
- [Material-UI](https://mui.com/) - Component library
- [Create React App](https://create-react-app.dev/) - Build tooling

## 📞 Contact

- **GitHub**: [@yourusername](https://github.com/vishwasT007)
- **Email**: vishwastarende1@gmail.com

---

⭐ **Star this repository if you found it helpful!**