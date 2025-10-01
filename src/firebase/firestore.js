import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// Collections
const USERS_COLLECTION = 'users';
const TODOS_COLLECTION = 'todos';

// User operations
export const createUserDocument = async (uid, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserDocument = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { user: userSnap.data(), error: null };
    } else {
      return { user: null, error: 'User not found' };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const updateUserDocument = async (uid, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Todo operations
export const createTodo = async (uid, todoData) => {
  try {
    const todosRef = collection(db, TODOS_COLLECTION);
    const docRef = await addDoc(todosRef, {
      ...todoData,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getTodos = async (uid) => {
  try {
    const todosRef = collection(db, TODOS_COLLECTION);
    const q = query(
      todosRef,
      where('userId', '==', uid)
    );
    
    const querySnapshot = await getDocs(q);
    const todos = [];
    
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Sort in JavaScript to avoid index requirement
    todos.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return bTime - aTime; // Descending order
    });
    
    return { todos, error: null };
  } catch (error) {
    return { todos: [], error: error.message };
  }
};

export const updateTodo = async (todoId, todoData) => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      ...todoData,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteTodo = async (todoId) => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await deleteDoc(todoRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const subscribeToTodos = (uid, callback) => {
  const todosRef = collection(db, TODOS_COLLECTION);
  const q = query(
    todosRef,
    where('userId', '==', uid)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Sort in JavaScript to avoid index requirement
    todos.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return bTime - aTime; // Descending order
    });
    
    callback(todos);
  });
};

// Analytics queries
export const getTodoStats = async (uid) => {
  try {
    const todosRef = collection(db, TODOS_COLLECTION);
    const q = query(todosRef, where('userId', '==', uid));
    
    const querySnapshot = await getDocs(q);
    const todos = [];
    
    querySnapshot.forEach((doc) => {
      todos.push(doc.data());
    });
    
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
    
    return { stats, error: null };
  } catch (error) {
    return { stats: null, error: error.message };
  }
};
