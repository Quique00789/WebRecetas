import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, get } from 'firebase/database';
import { auth, storage, database } from '../lib/firebase';

interface UserProfile {
  displayName?: string;
  photoURL?: string;
  bio?: string;
  phone?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: UserProfile) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Guardar datos del usuario en la base de datos
      await set(dbRef(database, `users/${user.uid}`), {
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      setCurrentUser(user);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verificar si el usuario ya existe en la base de datos
      const userSnapshot = await get(dbRef(database, `users/${user.uid}`));
      
      if (!userSnapshot.exists()) {
        // Si es un usuario nuevo, guardarlo en la base de datos
        await set(dbRef(database, `users/${user.uid}`), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Si ya existe, actualizar la información
        await set(dbRef(database, `users/${user.uid}`), {
          ...userSnapshot.val(),
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          updatedAt: new Date().toISOString()
        });
      }
      
      setCurrentUser(user);
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!currentUser) throw new Error('No user logged in');
    
    const imageRef = storageRef(storage, `profile-images/${currentUser.uid}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  const updateUserProfile = async (data: UserProfile) => {
    if (!currentUser) throw new Error('No user logged in');

    // Update Firebase Auth profile
    if (data.displayName || data.photoURL) {
      await updateProfile(currentUser, {
        displayName: data.displayName || currentUser.displayName,
        photoURL: data.photoURL || currentUser.photoURL
      });
    }

    // Update Realtime Database profile
    const userSnapshot = await get(dbRef(database, `users/${currentUser.uid}`));
    const existingData = userSnapshot.exists() ? userSnapshot.val() : {};
    
    await set(dbRef(database, `users/${currentUser.uid}`), {
      ...existingData,
      ...data,
      email: currentUser.email,
      updatedAt: new Date().toISOString()
    });

    // Update local state
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser };
    });
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Realtime Database
        const userDataSnapshot = await get(dbRef(database, `users/${user.uid}`));
        const userData = userDataSnapshot.val();
        if (userData) {
          // Update user profile if needed
          if (userData.displayName && !user.displayName) {
            await updateProfile(user, { displayName: userData.displayName });
          }
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    uploadProfileImage,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};