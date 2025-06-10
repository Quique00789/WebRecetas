export type FoodType = 'baked' | 'sweet' | 'fresh' | 'cold' | 'warm' | 'spicy' | 'natural' | 'energetic';

export interface Recipe {
  id: string;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'dessert';
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isFeatured: boolean;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  foodTypes: FoodType[];
}