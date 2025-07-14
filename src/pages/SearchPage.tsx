import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ref as dbRef, get } from 'firebase/database';
import { database } from '../lib/firebase';
import RecipeGrid from '../components/RecipeGrid';
import { Recipe } from '../types';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q') || '';
    setQuery(queryParam);

    const fetchRecipes = async () => {
      const snapshot = await get(dbRef(database, 'recipes'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allRecipes = Object.values(data) as Recipe[];
        const results = allRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(queryParam.toLowerCase()))
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    };

    if (queryParam) {
      fetchRecipes();
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [location.search]);

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="bg-gradient-to-r from-[#F5F5DC] to-[#FFD700]/20 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#8B4513]">
            Search Results
          </h1>
          {query && (
            <p className="text-[#8B7355] mt-2">
              Showing results for: <span className="font-medium">"{query}"</span>
            </p>
          )}
        </div>
      </div>

      <RecipeGrid 
        recipes={searchResults}
        title={searchResults.length > 0 
          ? `Found ${searchResults.length} recipe${searchResults.length === 1 ? '' : 's'}`
          : undefined
        }
      />
    </div>
  );
};

export default SearchPage;