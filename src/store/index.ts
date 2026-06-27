import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import ingredientsReducer from '../slices/ingredientsSlice';
import feedsReducer from '../slices/feedSlices';
import orderReducer from '../slices/orderSlice';
import userReducer from '../slices/userSlice';
import burgerConstructorReducer from '../slices/constructorSlice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    feeds: feedsReducer,
    order: orderReducer,
    user: userReducer,
    burgerConstructor: burgerConstructorReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
