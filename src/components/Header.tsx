import React, { useState } from 'react';
import { Search, Menu, X, User, PenSquare, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-amber-50 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-amber-800 flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Pastel</span>
            <span className="text-yellow-600">Recipes</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-amber-900 hover:text-amber-700 transition">
              Browse
            </Link>
            <Link to="/category/breakfast" className="text-amber-900 hover:text-amber-700 transition">
              Breakfast
            </Link>
            <Link to="/category/lunch" className="text-amber-900 hover:text-amber-700 transition">
              Lunch
            </Link>
            <Link to="/category/dinner" className="text-amber-900 hover:text-amber-700 transition">
              Dinner
            </Link>
            <Link to="/category/dessert" className="text-amber-900 hover:text-amber-700 transition">
              Dessert
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-300 border border-amber-200"
              />
              <button 
                type="submit" 
                className="bg-amber-500 text-white p-2 rounded-r-lg hover:bg-amber-600 transition"
              >
                <Search size={20} />
              </button>
            </form>

            {currentUser && (
              <Link
                to="/submit-recipe"
                className="hidden md:flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
              >
                <PenSquare size={18} className="mr-2" />
                Submit Recipe
              </Link>
            )}

            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-amber-100 transition flex items-center"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-amber-800" />
                )}
                {currentUser && (
                  <span className="ml-2 text-amber-800 hidden md:block">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-amber-100">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 text-sm text-amber-900 border-b border-amber-100">
                        {currentUser.email}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-amber-900 hover:bg-amber-50 transition flex items-center"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/submit-recipe"
                        className="block px-4 py-2 text-amber-900 hover:bg-amber-50 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <PenSquare size={16} className="mr-2 inline" />
                        Submit Recipe
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-amber-900 hover:bg-amber-50 transition flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-amber-900 hover:bg-amber-50 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-amber-900 hover:bg-amber-50 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button 
              className="md:hidden text-amber-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-amber-50 py-4 px-4 shadow-inner">
          <form onSubmit={handleSearch} className="mb-4 flex">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-300 border border-amber-200"
            />
            <button 
              type="submit" 
              className="bg-amber-500 text-white p-2 rounded-r-lg hover:bg-amber-600 transition"
            >
              <Search size={20} />
            </button>
          </form>
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/browse" 
              className="text-amber-900 hover:text-amber-700 transition py-2 border-b border-amber-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link 
              to="/category/breakfast" 
              className="text-amber-900 hover:text-amber-700 transition py-2 border-b border-amber-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Breakfast
            </Link>
            <Link 
              to="/category/lunch" 
              className="text-amber-900 hover:text-amber-700 transition py-2 border-b border-amber-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Lunch
            </Link>
            <Link 
              to="/category/dinner" 
              className="text-amber-900 hover:text-amber-700 transition py-2 border-b border-amber-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Dinner
            </Link>
            <Link 
              to="/category/dessert" 
              className="text-amber-900 hover:text-amber-700 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dessert
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;