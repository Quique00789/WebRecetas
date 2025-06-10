import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedRecipes } from '../data/recipes';
import RecipeCard from './RecipeCard';

const FeaturedRecipes: React.FC = () => {
  const featuredRecipes = getFeaturedRecipes();

  return (
    <section className="py-12 bg-gradient-to-r from-amber-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-amber-800">Featured Recipes</h2>
          <Link 
            to="/"
            className="flex items-center text-amber-600 hover:text-amber-700 transition"
          >
            <span>View all</span>
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;