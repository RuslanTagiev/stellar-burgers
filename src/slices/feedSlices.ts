import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type FeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', async () => {
  const res = await getFeedsApi();
  return res;
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.total = action.payload.total || 0;
        state.totalToday = action.payload.totalToday || 0;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить ленту';
      });
  }
});

export const getFeedsState = (state: RootState) => state.feeds;
export const getFeedsOrders = (state: RootState) => state.feeds.orders;
export const getFeedsTotal = (state: RootState) => state.feeds.total;
export const getFeedsTotalToday = (state: RootState) => state.feeds.totalToday;
export const getFeedsLoading = (state: RootState) => state.feeds.loading;
export const getFeedsError = (state: RootState) => state.feeds.error;

export default feedsSlice.reducer;
