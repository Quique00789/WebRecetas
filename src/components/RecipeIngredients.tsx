import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeIngredientsProps {
  recipe: Recipe;
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ recipe }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-[#8B4513] mb-4">Ingredients</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle size={18} className="text-[#FFA500] mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-[#8B7355]">{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;