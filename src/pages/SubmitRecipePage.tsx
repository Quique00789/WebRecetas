import React, { useState } from 'react';
import { ChefHat, Plus, Minus } from 'lucide-react';
import { ref as dbRef, get, set } from 'firebase/database';
import { database } from '../lib/firebase';
import { FoodType } from '../types';

const SubmitRecipePage: React.FC = () => {
  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodType[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const foodTypes: FoodType[] = ['baked', 'sweet', 'fresh', 'cold', 'warm', 'spicy', 'natural', 'energetic'];

  // Ingredient handlers
  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Instruction handlers
  const handleAddInstruction = () => setInstructions([...instructions, '']);
  const handleRemoveInstruction = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));
  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validaciones básicas
    if (!title || !category || !prepTime || !cookTime || !servings || !difficulty) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!imageUrl) {
      setError('Please provide an image URL for your recipe.');
      return;
    }
    if (ingredients.some(i => !i.trim())) {
      setError('Please fill in all ingredient fields.');
      return;
    }
    if (instructions.some(i => !i.trim())) {
      setError('Please fill in all instruction fields.');
      return;
    }

    setLoading(true);

    try {
      // 1. Leer recetas existentes para encontrar el mayor ID
      const recipesRef = dbRef(database, 'recipes');
      const snapshot = await get(recipesRef);
      let nextId = 1;
      if (snapshot.exists()) {
        const recipesData = snapshot.val();
        const ids = Object.values(recipesData)
          .map((r: any) => Number(r.id))
          .filter((id: number) => !isNaN(id));
        if (ids.length > 0) {
          nextId = Math.max(...ids) + 1;
        }
      }

      // 2. Crear receta con el nuevo ID
      const newRecipe = {
        id: String(nextId),
        title,
        category,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty,
        ingredients: ingredients.map(i => i.trim()),
        instructions: instructions.map(i => i.trim()),
        imageUrl,
        isFeatured: false,
        foodTypes: selectedFoodTypes,
      };

      // 3. Guardar la receta bajo el ID correspondiente
      await set(dbRef(database, `recipes/${nextId}`), newRecipe);

      setSuccess(true);
      // Limpiar formulario
      setTitle('');
      setCategory('');
      setPrepTime('');
      setCookTime('');
      setServings('');
      setDifficulty('');
      setIngredients(['']);
      setInstructions(['']);
      setSelectedFoodTypes([]);
      setImageUrl('');
    } catch (err) {
      setError('Error uploading recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center mb-8">
            <ChefHat size={32} className="text-amber-500 mr-4" />
            <h1 className="text-3xl font-bold text-amber-900">Submit Your Recipe</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Basic Information</h2>
              <div>
                <label className="block text-amber-900 font-medium mb-2">Recipe Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder="Enter recipe title"
                />
              </div>
              <div>
                <label className="block text-amber-900 font-medium mb-2">Category</label>
                <select
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="">Select category</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-amber-900 font-medium mb-2">Prep Time (minutes)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prepTime}
                    onChange={e => setPrepTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-amber-900 font-medium mb-2">Cook Time (minutes)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={cookTime}
                    onChange={e => setCookTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-amber-900 font-medium mb-2">Servings</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={servings}
                    onChange={e => setServings(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-amber-900 font-medium mb-2">Difficulty</label>
                <select
                  required
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="">Select difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Food Types */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Food Types</h2>
              <div className="flex flex-wrap gap-3">
                {foodTypes.map((type) => (
                  <label
                    key={type}
                    className={`px-4 py-2 rounded-full cursor-pointer transition ${
                      selectedFoodTypes.includes(type)
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedFoodTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFoodTypes([...selectedFoodTypes, type]);
                        } else {
                          setSelectedFoodTypes(selectedFoodTypes.filter(t => t !== type));
                        }
                      }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Recipe Image URL</h2>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-image.jpg"
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              {imageUrl && (
                <div className="mt-4 flex justify-center">
                  <img src={imageUrl} alt="Preview" className="max-h-40 rounded-lg shadow" />
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Ingredients</h2>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder="Enter ingredient"
                    className="flex-1 px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    disabled={ingredients.length === 1}
                  >
                    <Minus size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center text-amber-600 hover:text-amber-700 transition"
              >
                <Plus size={20} className="mr-1" />
                Add Ingredient
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Instructions</h2>
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-medium">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder="Enter instruction"
                    className="flex-1 px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    disabled={instructions.length === 1}
                  >
                    <Minus size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddInstruction}
                className="flex items-center text-amber-600 hover:text-amber-700 transition"
              >
                <Plus size={20} className="mr-1" />
                Add Instruction
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition font-medium"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Submit Recipe'}
            </button>
            {error && <div className="text-red-600 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">Recipe uploaded successfully!</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitRecipePage;