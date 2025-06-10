import React from 'react';
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Pastel Recipes</h3>
            <p className="text-amber-900 mb-4">
              Delicious recipes with a warm touch. Discover the joy of cooking with our carefully curated collection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-700 hover:text-amber-900 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-amber-700 hover:text-amber-900 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-amber-700 hover:text-amber-900 transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/breakfast" className="text-amber-900 hover:text-amber-700 transition">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link to="/category/lunch" className="text-amber-900 hover:text-amber-700 transition">
                  Lunch
                </Link>
              </li>
              <li>
                <Link to="/category/dinner" className="text-amber-900 hover:text-amber-700 transition">
                  Dinner
                </Link>
              </li>
              <li>
                <Link to="/category/dessert" className="text-amber-900 hover:text-amber-700 transition">
                  Dessert
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Newsletter</h3>
            <p className="text-amber-900 mb-4">
              Subscribe to our newsletter for new recipes and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-300 border border-amber-200 w-full"
              />
              <button 
                type="submit" 
                className="bg-amber-500 text-white px-4 py-2 rounded-r-lg hover:bg-amber-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-amber-200 text-center text-amber-900">
          <p className="flex items-center justify-center">
            Made with <Heart size={16} className="mx-1 text-yellow-600" /> in 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;