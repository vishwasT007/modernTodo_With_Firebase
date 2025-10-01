import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, signUpWithEmail, signInWithEmail, signOutUser } from '../firebase/auth';
import { getUserDocument, subscribeToTodos } from '../firebase/firestore';
import { useApp } from './AppContext';
import { handleFirestoreError } from '../utils/firestoreErrorHandler';

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [firebaseTodos, setFirebaseTodos] = useState([]);
  const [firebaseStats, setFirebaseStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('FirebaseContext - Auth state changed:', !!user);
      setLoading(true);
      
      // Add a timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.log('FirebaseContext - Loading timeout, setting loading to false');
        setLoading(false);
      }, 5000);
      
      try {
        if (user) {
        setFirebaseUser(user);
        
        // Get user document from Firestore
        const { user: userDoc, error: userError } = await getUserDocument(user.uid);
        if (userError) {
          // Use basic user data from Firebase Auth
          const basicUserData = {
            firstName: user.displayName?.split(' ')[0] || 'User',
            lastName: user.displayName?.split(' ')[1] || '',
            email: user.email,
            createdAt: new Date(),
            emailVerified: user.emailVerified,
          };
          
          setUserData(basicUserData);
          
          // Try to create user document if it doesn't exist
          try {
            const { createUserDocument } = await import('../firebase/firestore');
            await createUserDocument(user.uid, basicUserData);
            console.log('✅ User document created successfully');
          } catch (docError) {
            const errorInfo = handleFirestoreError(docError, 'user document creation');
            if (errorInfo.isPermissionError) {
              console.info('ℹ️ Account created! Some features require Firestore rules deployment.');
            }
          }
        } else {
          setUserData(userDoc);
        }

        // Subscribe to real-time todos updates
        let unsubscribeTodos = null;
        try {
          unsubscribeTodos = subscribeToTodos(user.uid, (todos) => {
            setFirebaseTodos(todos);
            
            // Update stats
            const stats = {
              total: todos.length,
              completed: todos.filter(todo => todo.completed).length,
              pending: todos.filter(todo => !todo.completed).length,
              overdue: todos.filter(todo => 
                !todo.completed && 
                todo.dueDate && 
                new Date(todo.dueDate?.toDate ? todo.dueDate.toDate() : todo.dueDate) < new Date()
              ).length,
            };
            setFirebaseStats(stats);
          });
        } catch (todosError) {
          const errorInfo = handleFirestoreError(todosError, 'todos subscription');
          // Initialize with empty arrays
          setFirebaseTodos([]);
          setFirebaseStats({
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
          });
        }

        // Cleanup function
        return () => {
          if (unsubscribeTodos) {
            unsubscribeTodos();
          }
        };
      } else {
        setFirebaseUser(null);
        setUserData(null);
        setFirebaseTodos([]);
        setFirebaseStats({
          total: 0,
          completed: 0,
          pending: 0,
          overdue: 0,
        });
        }
      } catch (error) {
        console.error('FirebaseContext - Error in auth state change:', error);
      } finally {
        clearTimeout(loadingTimeout);
        console.log('FirebaseContext - Setting loading to false');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array - only run once on mount

  // Function to refresh user data
  const refreshUserData = async () => {
    if (firebaseUser) {
      const { user: userDoc, error: userError } = await getUserDocument(firebaseUser.uid);
      if (!userError && userDoc) {
        setUserData(userDoc);
      }
    }
  };

  const value = {
    user: userData, // For compatibility with existing components
    firebaseUser,
    userData,
    firebaseTodos,
    firebaseStats,
    loading,
    refreshUserData,
    // Authentication functions
    signUpWithEmail,
    signInWithEmail,
    signOutUser,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext };
