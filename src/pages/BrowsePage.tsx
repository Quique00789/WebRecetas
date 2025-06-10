import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { recipes } from '../data/recipes';
import RecipeGrid from '../components/RecipeGrid';
import RecipeMenu from '../components/RecipeMenu';
import { FoodType, Recipe } from '../types';

const BrowsePage: React.FC = () => {
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodType[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Recipe['difficulty']>();
  const [maxPrepTime, setMaxPrepTime] = useState<number>(60);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const foodTypes: FoodType[] = ['baked', 'sweet', 'fresh', 'cold', 'warm', 'spicy', 'natural', 'energetic'];
  const difficulties: Recipe['difficulty'][] = ['easy', 'medium', 'hard'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesFoodTypes = selectedFoodTypes.length === 0 || 
      recipe.foodTypes.some(type => selectedFoodTypes.includes(type));
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    const matchesPrepTime = recipe.prepTime + recipe.cookTime <= maxPrepTime;
    
    return matchesFoodTypes && matchesDifficulty && matchesPrepTime;
  });

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Food Types</h3>
        <div className="space-y-2">
          {foodTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFoodTypes.includes(type)}
                onChange={() => {
                  if (selectedFoodTypes.includes(type)) {
                    setSelectedFoodTypes(selectedFoodTypes.filter(t => t !== type));
                  } else {
                    setSelectedFoodTypes([...selectedFoodTypes, type]);
                  }
                }}
                className="rounded border-amber-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="ml-2 text-amber-800 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Difficulty</h3>
        <div className="space-y-2">
          {difficulties.map(diff => (
            <label key={diff} className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                checked={selectedDifficulty === diff}
                onChange={() => setSelectedDifficulty(diff)}
                className="border-amber-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="ml-2 text-amber-800 capitalize">{diff}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-amber-900 mb-3">
          Maximum Total Time: {maxPrepTime} min
        </h3>
        <input
          type="range"
          min="10"
          max="120"
          value={maxPrepTime}
          onChange={(e) => setMaxPrepTime(Number(e.target.value))}
          className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <button
        onClick={() => {
          setSelectedFoodTypes([]);
          setSelectedDifficulty(undefined);
          setMaxPrepTime(60);
        }}
        className="w-full bg-amber-100 text-amber-800 py-2 rounded-lg hover:bg-amber-200 transition"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900">Browse Recipes</h1>
          <button
            className="md:hidden bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter size={20} className="mr-2" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Recipe Categories Menu */}
          <div className="hidden md:block w-64">
            <div className="sticky top-24">
              <RecipeMenu />
              <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
                <Filters />
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-amber-900">Filters</h2>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="text-amber-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                <RecipeMenu />
                <div className="mt-6">
                  <Filters />
                </div>
              </div>
            </div>
          )}

          {/* Recipe Grid */}
          <div className="flex-1">
            <RecipeGrid 
              recipes={filteredRecipes}
              title={`${filteredRecipes.length} Recipe${filteredRecipes.length === 1 ? '' : 's'} Found`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;