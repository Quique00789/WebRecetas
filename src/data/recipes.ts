import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Strawberry Pancakes',
    category: 'breakfast',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    isFeatured: true,
    imageUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
    foodTypes: ['baked', 'sweet'],
    ingredients: [
      '2 cups all-purpose flour',
      '2 tbsp sugar',
      '1 tsp baking powder',
      '1/2 tsp baking soda',
      '1/2 tsp salt',
      '2 eggs',
      '2 cups buttermilk',
      '1/4 cup melted butter',
      '1 cup fresh strawberries, sliced',
      'Maple syrup for serving'
    ],
    instructions: [
      'In a large bowl, whisk together flour, sugar, baking powder, baking soda, and salt.',
      'In another bowl, beat the eggs, then add buttermilk and melted butter.',
      'Pour the wet ingredients into the dry ingredients and stir until just combined.',
      'Fold in the sliced strawberries.',
      'Heat a lightly oiled griddle or frying pan over medium heat.',
      'Pour 1/4 cup of batter onto the griddle for each pancake.',
      'Cook until bubbles form on the surface, then flip and cook until golden brown.',
      'Serve with maple syrup and additional strawberries if desired.'
    ]
  },
  {
    id: '2',
    title: 'Avocado Toast',
    category: 'breakfast',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    difficulty: 'easy',
    isFeatured: false,
    imageUrl: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
    foodTypes: ['fresh', 'natural'],
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '1/4 tsp salt',
      '1/4 tsp black pepper',
      '1/4 tsp red pepper flakes',
      '1 tbsp olive oil',
      '1/2 lemon, juiced',
      '2 eggs (optional)'
    ],
    instructions: [
      'Toast the bread slices until golden and crispy.',
      'Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.',
      'Add salt, pepper, and lemon juice to the avocado and mash with a fork.',
      'Spread the mashed avocado evenly on the toast slices.',
      'If using eggs, fry or poach them and place on top of the avocado.',
      'Sprinkle with red pepper flakes and drizzle with olive oil.',
      'Serve immediately.'
    ]
  },
  {
    id: '3',
    title: 'Greek Salad',
    category: 'lunch',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    isFeatured: true,
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
    foodTypes: ['fresh', 'cold', 'natural'],
    ingredients: [
      '1 large cucumber, diced',
      '4 large tomatoes, diced',
      '1 red onion, thinly sliced',
      '1 green bell pepper, diced',
      '1 cup Kalamata olives',
      '200g feta cheese, cubed',
      '2 tbsp extra virgin olive oil',
      '1 tbsp red wine vinegar',
      '1 tsp dried oregano',
      'Salt and pepper to taste'
    ],
    instructions: [
      'In a large bowl, combine cucumber, tomatoes, red onion, bell pepper, and olives.',
      'Add the cubed feta cheese on top.',
      'In a small bowl, whisk together olive oil, red wine vinegar, oregano, salt, and pepper.',
      'Pour the dressing over the salad and toss gently to combine.',
      'Let sit for 10 minutes before serving to allow flavors to meld.'
    ]
  },
  {
    id: '4',
    title: 'Chocolate Chip Cookies',
    category: 'dessert',
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'medium',
    isFeatured: true,
    imageUrl: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
    foodTypes: ['baked', 'sweet', 'warm'],
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup unsalted butter, softened',
      '3/4 cup granulated sugar',
      '3/4 cup packed brown sugar',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups semisweet chocolate chips'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'In a small bowl, mix flour, baking soda, and salt.',
      'In a large bowl, cream together butter, granulated sugar, and brown sugar until smooth.',
      'Beat in eggs one at a time, then stir in vanilla.',
      'Gradually blend in the dry ingredients.',
      'Stir in chocolate chips.',
      'Drop rounded tablespoons of dough onto ungreased baking sheets.',
      'Bake for 9 to 11 minutes or until golden brown.',
      'Let stand on baking sheet for 2 minutes, then remove to cool on wire racks.'
    ]
  },
  {
    id: '5',
    title: 'Vegetable Stir Fry',
    category: 'dinner',
    prepTime: 20,
    cookTime: 10,
    servings: 4,
    difficulty: 'medium',
    isFeatured: false,
    imageUrl: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
    foodTypes: ['warm', 'spicy', 'natural'],
    ingredients: [
      '2 tbsp vegetable oil',
      '2 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '1 bell pepper, sliced',
      '1 carrot, julienned',
      '1 cup broccoli florets',
      '1 cup snap peas',
      '1 cup mushrooms, sliced',
      '3 tbsp soy sauce',
      '1 tbsp oyster sauce',
      '1 tsp sesame oil',
      '1/4 cup water',
      '1 tbsp cornstarch'
    ],
    instructions: [
      'In a small bowl, mix soy sauce, oyster sauce, sesame oil, water, and cornstarch. Set aside.',
      'Heat vegetable oil in a wok or large frying pan over high heat.',
      'Add garlic and ginger, stir-fry for 30 seconds until fragrant.',
      'Add bell pepper and carrot, stir-fry for 2 minutes.',
      'Add broccoli, snap peas, and mushrooms, stir-fry for 3-4 minutes until vegetables are tender-crisp.',
      'Pour the sauce over the vegetables and stir well.',
      'Cook for another 1-2 minutes until the sauce thickens.',
      'Serve hot with rice or noodles.'
    ]
  },
  {
    id: '6',
    title: 'Berry Smoothie Bowl',
    category: 'breakfast',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: 'easy',
    isFeatured: false,
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
    foodTypes: ['cold', 'sweet', 'energetic'],
    ingredients: [
      '1 frozen banana',
      '1 cup mixed frozen berries',
      '1/4 cup Greek yogurt',
      '1/4 cup almond milk',
      '1 tbsp honey',
      'Toppings: sliced fresh fruit, granola, chia seeds, coconut flakes'
    ],
    instructions: [
      'In a blender, combine frozen banana, frozen berries, Greek yogurt, almond milk, and honey.',
      'Blend until smooth and creamy. The mixture should be thick enough to eat with a spoon.',
      'Pour into a bowl and top with your choice of fresh fruit, granola, chia seeds, and coconut flakes.',
      'Serve immediately and enjoy with a spoon.'
    ]
  }
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

export const getRecipesByCategory = (category: Recipe['category']): Recipe[] => {
  return recipes.filter(recipe => recipe.category === category);
};

export const getFeaturedRecipes = (): Recipe[] => {
  return recipes.filter(recipe => recipe.isFeatured);
};

export const searchRecipes = (query: string): Recipe[] => {
  const lowercaseQuery = query.toLowerCase();
  return recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(lowercaseQuery) || 
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
  );
};