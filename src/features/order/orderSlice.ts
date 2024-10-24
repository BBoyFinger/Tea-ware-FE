import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IOrder } from "../../types/order.type";
import { orderServices } from "./orderService";

interface IOrderState {
  order: IOrder | null;
  orders: IOrder[];
  isLoading: boolean;
  updatedOrder: any;
  deletedOrder: any;
  createdOrder: any;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: IOrderState = {
  order: null,
  orders: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  updatedOrder: null,
  deletedOrder: null,
  createdOrder: null,
  message: "",
};

export const getCategories = createAsyncThunk("orders", async (_, thunkApi) => {
  try {
    return await orderServices.getOrders();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const createOrder = createAsyncThunk(
  "create-Order",
  async (data: IOrder, thunkApi) => {
    try {
      return await orderServices.createOrder(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "update-Order",
  async (data: IOrder, thunkApi) => {
    try {
      return await orderServices.editOrder(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "delete-Order",
  async (ids: string[], thunkApi) => {
    try {
      return await orderServices.deleteOrder(ids);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.orders = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedOrder = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      });
  },
});

export default orderSlice.reducer;
