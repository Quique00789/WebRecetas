import React from 'react';
import { useParams } from 'react-router-dom';
import { getRecipesByCategory } from '../data/recipes';
import RecipeGrid from '../components/RecipeGrid';
import { Recipe } from '../types';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const validCategory = category as Recipe['category'];
  const recipes = getRecipesByCategory(validCategory);

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
            {categoryTitles[validCategory] || 'Recipes'}
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