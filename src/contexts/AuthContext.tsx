import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, get } from 'firebase/database';
import { auth, storage, database } from '../lib/firebase';

interface UserProfile {
  displayName?: string;
  photoURL?: string;
  bio?: string;
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCredential.user);
    await set(dbRef(database, `users/${userCredential.user.uid}`), {
      email: userCredential.user.email,
      createdAt: new Date().toISOString()
    });
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCredential.user);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setCurrentUser(result.user);
    
    // Store user data in Realtime Database
    await set(dbRef(database, `users/${result.user.uid}`), {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      createdAt: new Date().toISOString()
    });
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
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
    await set(dbRef(database, `users/${currentUser.uid}`), {
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
    uploadProfileImage
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};