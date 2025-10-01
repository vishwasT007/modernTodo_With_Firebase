// Firestore Error Handler
// This utility helps handle Firestore permission errors gracefully

export const handleFirestoreError = (error, context = '') => {
  // Suppress permission denied errors in console to reduce noise
  if (error.code === 'permission-denied') {
    console.log(`ℹ️ Firestore permission denied in ${context} (rules not deployed yet)`);
    return {
      isPermissionError: true,
      userMessage: 'Some features require Firestore rules deployment',
      shouldRetry: false
    };
  }
  
  // Handle other common Firestore errors
  if (error.code === 'unavailable') {
    console.warn(`⚠️ Firestore unavailable in ${context}:`, error.message);
    return {
      isPermissionError: false,
      userMessage: 'Database temporarily unavailable',
      shouldRetry: true
    };
  }
  
  if (error.code === 'deadline-exceeded') {
    console.warn(`⚠️ Firestore timeout in ${context}:`, error.message);
    return {
      isPermissionError: false,
      userMessage: 'Request timed out, please try again',
      shouldRetry: true
    };
  }
  
  // Log other errors normally
  console.error(`❌ Firestore error in ${context}:`, error);
  return {
    isPermissionError: false,
    userMessage: 'An unexpected error occurred',
    shouldRetry: false
  };
};

// Suppress specific Firestore permission errors in console
export const suppressFirestorePermissionErrors = () => {
  const originalError = console.error;
  console.error = (...args) => {
    // Check if this is a Firestore permission denied error
    const errorMessage = args.join(' ');
    if (errorMessage.includes('permission-denied') && errorMessage.includes('Firestore')) {
      // Suppress this specific error
      return;
    }
    // Log other errors normally
    originalError.apply(console, args);
  };
};
