import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Recipe, FoodType } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const foodTypeColors: Record<FoodType, { bg: string; text: string }> = {
  baked: { bg: '#F5F5DC', text: '#8B4513' },    // Beige/cream for baked goods
  sweet: { bg: '#FFC0CB', text: '#8B4513' },    // Pink for sweet items
  fresh: { bg: '#98FB98', text: '#2E4A3D' },    // Mint green for fresh items
  cold: { bg: '#ADD8E6', text: '#2E4A3D' },     // Light blue for cold items
  warm: { bg: '#FFA500', text: '#FFFFFF' },     // Orange for warm dishes
  spicy: { bg: '#FF6347', text: '#FFFFFF' },    // Red for spicy foods
  natural: { bg: '#D2B48C', text: '#8B4513' },  // Tan for natural foods
  energetic: { bg: '#FFD700', text: '#8B4513' } // Yellow for energetic foods
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link 
      to={`/recipe/${recipe.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 m-2 rounded">
          {recipe.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
          {recipe.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-amber-500" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1 text-amber-500" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {recipe.foodTypes.map((type) => (
            <span
              key={type}
              style={{
                backgroundColor: foodTypeColors[type].bg,
                color: foodTypeColors[type].text
              }}
              className="px-2 py-1 text-xs rounded-full"
            >
              {type}
            </span>
          ))}
        </div>
        
        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
            recipe.difficulty === 'easy' 
              ? 'bg-green-100 text-green-800' 
              : recipe.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {recipe.difficulty}
          </span>
          {recipe.isFeatured && (
            <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
              Featured
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;