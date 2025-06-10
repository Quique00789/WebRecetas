import React from 'react';
import { Utensils } from 'lucide-react';
import { recipes } from '../data/recipes';
import RecipeGrid from '../components/RecipeGrid';
import FeaturedRecipes from '../components/FeaturedRecipes';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <section className="relative bg-gradient-to-r from-amber-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 leading-tight">
              Delicious Recipes with a Warm Touch
            </h1>
            <p className="text-lg text-amber-800 mb-8">
              Discover our collection of easy-to-follow recipes that bring joy to your kitchen.
              From breakfast to dessert, we've got you covered.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/browse" 
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition transform hover:-translate-y-1 inline-flex items-center"
              >
                <Utensils size={20} className="mr-2" />
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-6 right-10 w-24 h-24 bg-yellow-100 rounded-full opacity-50"></div>
        <div className="absolute top-10 right-20 w-16 h-16 bg-amber-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-yellow-200 rounded-full opacity-50"></div>
      </section>

      <FeaturedRecipes />
      
      <section id="recipes" className="py-12">
        <RecipeGrid recipes={recipes} title="All Recipes" />
      </section>
    </div>
  );
};

export default HomePage;