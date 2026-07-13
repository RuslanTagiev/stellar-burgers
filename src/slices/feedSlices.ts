import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type FeedsState = {
  orders: TOrder[];
  orderByNumber: TOrder | null;
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: FeedsState = {
  orders: [],
  orderByNumber: null,
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', async () => {
  const res = await getFeedsApi();
  return res;
});

export const fetchOrderByNumber = createAsyncThunk<TOrder | null, number>(
  'feeds/fetchOrderByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0] || null;
  }
);

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
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      });
  }
});

export const getFeedsState = (state: RootState) => state.feeds;
export const getFeedsOrders = (state: RootState) => state.feeds.orders;
export const getOrderByNumberData = (state: RootState) =>
  state.feeds.orderByNumber;
export const getFeedsTotal = (state: RootState) => state.feeds.total;
export const getFeedsTotalToday = (state: RootState) => state.feeds.totalToday;
export const getFeedsLoading = (state: RootState) => state.feeds.loading;
export const getFeedsError = (state: RootState) => state.feeds.error;

export default feedsSlice.reducer;
