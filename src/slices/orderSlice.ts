import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type OrderState = {
  orderData: TOrder | null;
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderData: null,
  orders: [],
  loading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchOrderByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'order/fetchProfileOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOrdersApi();
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.message || 'Не удалось загрузить историю заказов'
      );
    }
  }
);

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const res = await orderBurgerApi(ingredientIds);
    const orderData = res.order as any;
    return {
      ...orderData,
      ingredients: orderData.ingredients || []
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Не удалось оформить заказ');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось оформить заказ';
      });
  }
});

export const getOrderState = (state: RootState) => state.order;
export const getOrderData = (state: RootState) => state.order.orderData;
export const getProfileOrders = (state: RootState) => state.order.orders;
export const getOrderLoading = (state: RootState) => state.order.loading;
export const getOrderError = (state: RootState) => state.order.error;

export const { resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
