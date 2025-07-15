import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref as dbRef, get } from 'firebase/database';
import { database } from '../lib/firebase';
import RecipeHeader from '../components/RecipeHeader';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeInstructions from '../components/RecipeInstructions';
import { ArrowLeft, Printer, Share2, Bookmark } from 'lucide-react';
import { Recipe } from '../types';
import { toast } from 'react-hot-toast'; // Si usas alguna librería de toast, si no, usa alert

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

  // Guardar receta en localStorage
  const handleSave = () => {
    if (!recipe) return;
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    const exists = saved.some((r: Recipe) => r.id === recipe.id);
    if (exists) {
      // Puedes usar toast o alert
      alert('Recipe already saved!');
      return;
    }
    saved.push(recipe);
    localStorage.setItem('savedRecipes', JSON.stringify(saved));
    alert('Recipe saved!');
  };

  // Compartir receta
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: recipe?.title,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Imprimir receta
  const handlePrint = () => {
    window.print();
  };

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
          <button
            className="bg-purple-100 text-purple-700 p-2 rounded-full hover:bg-purple-200 transition"
            onClick={handlePrint}
          >
            <Printer size={20} />
          </button>
          <button
            className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition"
            onClick={handleShare}
          >
            <Share2 size={20} />
          </button>
          <button
            className="bg-pink-100 text-pink-700 p-2 rounded-full hover:bg-pink-200 transition"
            onClick={handleSave}
          >
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