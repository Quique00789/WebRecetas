import React from 'react';
import { Recipe } from '../types';

interface RecipeInstructionsProps {
  recipe: Recipe;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({ recipe }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-[#8B4513] mb-4">Instructions</h3>
      <ol className="space-y-4">
        {recipe.instructions.map((instruction, index) => (
          <li key={index} className="flex">
            <div className="flex-shrink-0 bg-[#FFD700]/20 text-[#8B4513] w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium">
              {index + 1}
            </div>
            <div className="pt-1">
              <p className="text-[#8B7355]">{instruction}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeInstructions;