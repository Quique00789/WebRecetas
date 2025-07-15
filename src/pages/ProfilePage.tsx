import React, { useEffect, useState, useRef } from 'react';
import { ref as dbRef, get, remove, set } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';
import { Camera, Loader, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, uploadProfileImage } = useAuth();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchRecipes = async () => {
      const snapshot = await get(dbRef(database, 'recipes'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const recipesArray = Object.values(data) as Recipe[];
        const userRecipes = recipesArray.filter(recipe => recipe.userId === currentUser.uid);
        setMyRecipes(userRecipes);
      } else {
        setMyRecipes([]);
      }
      setLoading(false);
    };
    
    const fetchUserProfile = async () => {
      const userSnapshot = await get(dbRef(database, `users/${currentUser.uid}`));
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setBio(userData.bio || '');
      }
    };
    
    fetchRecipes();
    fetchUserProfile();
  }, [currentUser]);

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await remove(dbRef(database, `recipes/${recipeId}`));
      setMyRecipes(myRecipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const handleUpdateRecipe = async (updatedRecipe: Recipe) => {
    try {
      await set(dbRef(database, `recipes/${updatedRecipe.id}`), updatedRecipe);
      setMyRecipes(myRecipes.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      ));
      setEditingRecipe(null);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe. Please try again.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      setProfileLoading(true);
      const file = e.target.files[0];
      const photoURL = await uploadProfileImage(file);
      await updateUserProfile({ photoURL });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await updateUserProfile({ displayName, bio });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">Please log in to view your profile</h2>
          <Link to="/login" className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition">
            Log In
          </Link>
        </div>
      </div>
    );
  }

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
              disabled={profileLoading}
              className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {profileLoading ? (
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-amber-900">My Recipes ({myRecipes.length})</h2>
            <Link
              to="/submit-recipe"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add Recipe
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <Loader className="animate-spin mx-auto mb-4" size={32} />
              <p className="text-amber-700">Loading your recipes...</p>
            </div>
          ) : myRecipes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <h3 className="text-xl font-semibold text-amber-900 mb-2">No recipes yet</h3>
              <p className="text-amber-700 mb-4">Start sharing your delicious recipes with the community!</p>
              <Link
                to="/submit-recipe"
                className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
              >
                Submit Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myRecipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <RecipeCard recipe={recipe} />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleEditRecipe(recipe)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition shadow-lg"
                      title="Edit recipe"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                      title="Delete recipe"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Recipe Modal */}
        {editingRecipe && (
          <EditRecipeModal
            recipe={editingRecipe}
            onSave={handleUpdateRecipe}
            onCancel={() => setEditingRecipe(null)}
          />
        )}
      </div>
    </div>
  );
};

// Edit Recipe Modal Component
interface EditRecipeModalProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ recipe, onSave, onCancel }) => {
  const [title, setTitle] = useState(recipe.title);
  const [category, setCategory] = useState(recipe.category);
  const [prepTime, setPrepTime] = useState(recipe.prepTime.toString());
  const [cookTime, setCookTime] = useState(recipe.cookTime.toString());
  const [servings, setServings] = useState(recipe.servings.toString());
  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecipe: Recipe = {
      ...recipe,
      title,
      category,
      prepTime: Number(prepTime),
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty,
      ingredients,
      instructions,
      imageUrl,
    };
    onSave(updatedRecipe);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">Edit Recipe</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-900 font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-900 font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Recipe['category'])}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div>
                <label className="block text-amber-900 font-medium mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Recipe['difficulty'])}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                >
                  <option value="easy">Easy</option>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-amber-900 font-medium mb-2">Prep Time (min)</label>
                <input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-amber-900 font-medium mb-2">Cook Time (min)</label>
                <input
                  type="number"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-amber-900 font-medium mb-2">Servings</label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                  min="1"
                />
              </div>
            </div>
                  <option value="medium">Medium</option>
            <div>
              <label className="block text-amber-900 font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                required
              />
            </div>
                  <option value="hard">Hard</option>
            <div>
              <label className="block text-amber-900 font-medium mb-2">Ingredients</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index] = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    disabled={ingredients.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setIngredients([...ingredients, ''])}
                className="text-amber-600 hover:text-amber-700 transition"
              >
                + Add Ingredient
              </button>
            </div>
                </select>
            <div>
              <label className="block text-amber-900 font-medium mb-2">Instructions</label>
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-medium">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => {
                      const newInstructions = [...instructions];
                      newInstructions[index] = e.target.value;
                      setInstructions(newInstructions);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setInstructions(instructions.filter((_, i) => i !== index))}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    disabled={instructions.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setInstructions([...instructions, ''])}
                className="text-amber-600 hover:text-amber-700 transition"
              >
                + Add Instruction
              </button>
            </div>
              </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
            </div>
export default ProfilePage;