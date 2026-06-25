import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientsItems } from '../../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(getIngredientsItems);
  const ingredientData =
    ingredients.find((ing: TIngredient) => ing._id === id) || null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
