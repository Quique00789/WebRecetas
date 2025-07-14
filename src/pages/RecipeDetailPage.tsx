import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref as dbRef, get } from 'firebase/database';
import { database } from '../lib/firebase';
import RecipeHeader from '../components/RecipeHeader';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeInstructions from '../components/RecipeInstructions';
import { ArrowLeft, Printer, Share2, Bookmark } from 'lucide-react';
import { Recipe } from '../types';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const snapshot = await get(dbRef(database, `recipes/${id}`));
      if (snapshot.exists()) {
        setRecipe(snapshot.val() as Recipe);
      } else {
        setRecipe(null);
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Recipe not found</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-pink-700 hover:text-pink-800 transition"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back</span>
      </button>

      <RecipeHeader recipe={recipe} />

      <div className="flex justify-end mb-8">
        <div className="flex space-x-3">
          <button className="bg-purple-100 text-purple-700 p-2 rounded-full hover:bg-purple-200 transition">
            <Printer size={20} />
          </button>
          <button className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition">
            <Share2 size={20} />
          </button>
          <button className="bg-pink-100 text-pink-700 p-2 rounded-full hover:bg-pink-200 transition">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <RecipeIngredients recipe={recipe} />
        <RecipeInstructions recipe={recipe} />
      </div>
    </div>
  );
};

export default RecipeDetailPage;