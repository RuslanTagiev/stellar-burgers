import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import feedsReducer from '../slices/feedSlices';
import orderReducer from '../slices/orderSlice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    feeds: feedsReducer,
    order: orderReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
