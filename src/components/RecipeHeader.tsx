import React from 'react';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Recipe, FoodType } from '../types';

interface RecipeHeaderProps {
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

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe }) => {
  return (
    <div className="mb-8">
      <div className="relative h-64 md:h-96 overflow-hidden rounded-xl mb-6">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.foodTypes.map((type) => (
              <span
                key={type}
                style={{
                  backgroundColor: foodTypeColors[type].bg,
                  color: foodTypeColors[type].text
                }}
                className="px-3 py-1 text-sm font-medium rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
          <span className="inline-block bg-[#98FB98] text-[#2E4A3D] text-sm font-medium px-3 py-1 rounded-full mb-2">
            {recipe.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{recipe.title}</h1>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
          <div className="flex items-center bg-[#FFD700]/20 text-[#8B7355] px-4 py-2 rounded-lg">
            <Clock size={20} className="mr-2" />
            <div>
              <p className="text-xs text-[#8B7355]">Total Time</p>
              <p className="font-medium">{recipe.prepTime + recipe.cookTime} min</p>
            </div>
          </div>
          
          <div className="flex items-center bg-[#FFC0CB]/20 text-[#8B4513] px-4 py-2 rounded-lg">
            <Users size={20} className="mr-2" />
            <div>
              <p className="text-xs text-[#8B4513]">Servings</p>
              <p className="font-medium">{recipe.servings}</p>
            </div>
          </div>
          
          <div className="flex items-center bg-[#F5F5DC]/50 text-[#8B7355] px-4 py-2 rounded-lg">
            <ChefHat size={20} className="mr-2" />
            <div>
              <p className="text-xs text-[#8B7355]">Difficulty</p>
              <p className="font-medium capitalize">{recipe.difficulty}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;