import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

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
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить ленту';
      });
  }
});

export const getFeedsState = (state: { feeds: FeedsState }) => state.feeds;

export const getFeedsOrders = (state: { feeds: FeedsState }) =>
  state.feeds.orders;

export const getFeedsTotal = (state: { feeds: FeedsState }) =>
  state.feeds.total;

export const getFeedsTotalToday = (state: { feeds: FeedsState }) =>
  state.feeds.totalToday;

export const getFeedsLoading = (state: { feeds: FeedsState }) =>
  state.feeds.loading;

export const getFeedsError = (state: { feeds: FeedsState }) =>
  state.feeds.error;

export default feedsSlice.reducer;
