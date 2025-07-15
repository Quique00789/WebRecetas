import React, { useEffect, useState, useRef } from 'react';
import { ref as dbRef, get, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import RecipeGrid from '../components/RecipeGrid';
import { Recipe } from '../types';
import { Camera, Loader } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, uploadProfileImage } = useAuth();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchRecipes = async () => {
      const snapshot = await get(dbRef(database, 'recipes'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Filtra solo las recetas del usuario actual
        const recipesArray = Object.values(data) as Recipe[];
        setMyRecipes(recipesArray.filter(r => r.userId === currentUser.uid));
      } else {
        setMyRecipes([]);
      }
      setLoading(false);
    };
    fetchRecipes();
  }, [currentUser]);

  // Eliminar receta
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta receta?')) return;
    await remove(dbRef(database, `recipes/${id}`));
    setMyRecipes(myRecipes.filter(r => r.id !== id));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      setLoading(true);
      const file = e.target.files[0];
      const photoURL = await uploadProfileImage(file);
      await updateUserProfile({ photoURL });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile({ displayName, bio });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-8">Profile Settings</h1>

          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src={currentUser?.photoURL || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full text-white hover:bg-amber-600 transition"
              >
                <Camera size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-amber-900 font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label className="block text-amber-900 font-medium mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 h-32"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2\" size={20} />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Mis Recetas</h2>
          {loading ? (
            <div>Cargando...</div>
          ) : myRecipes.length === 0 ? (
            <div>No has subido recetas aún.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myRecipes.map(recipe => (
                <div key={recipe.id} className="relative">
                  <RecipeGrid recipes={[recipe]} />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                    {/* Aquí puedes agregar un botón para editar */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;