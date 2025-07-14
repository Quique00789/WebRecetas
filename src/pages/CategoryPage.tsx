import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref as dbRef, get } from 'firebase/database';
import { database } from '../lib/firebase';
import RecipeGrid from '../components/RecipeGrid';
import { Recipe } from '../types';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const snapshot = await get(dbRef(database, 'recipes'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allRecipes = Object.values(data) as Recipe[];
        setRecipes(allRecipes.filter(r => r.category === category));
      } else {
        setRecipes([]);
      }
      setLoading(false);
    };
    fetchRecipes();
  }, [category]);

  const categoryTitles: Record<Recipe['category'], string> = {
    breakfast: 'Breakfast Recipes',
    lunch: 'Lunch Recipes',
    dinner: 'Dinner Recipes',
    dessert: 'Dessert Recipes'
  };

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="bg-gradient-to-r from-[#F5F5DC] to-[#FFD700]/20 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#8B4513]">
            {categoryTitles[category as Recipe['category']] || 'Recipes'}
          </h1>
          <p className="text-[#8B7355] mt-2">
            Discover our collection of delicious {category} recipes.
          </p>
        </div>
      </div>

      <RecipeGrid recipes={recipes} />
    </div>
  );
};

export default CategoryPage;