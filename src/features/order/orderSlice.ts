import {
  createSlice,
  createAction,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IOrder } from "../../types/order.type";
import { orderServices } from "./orderService";
import axios from "axios";

let config = {
  headers: {
    "Content-Type": "application/json",
    Token: "497989ae-9cc3-11ef-abbe-867a64c2e80d",
    withCredentials: false,
  },
};

interface IOrderState {
  provinces: any[];
  districts: any[];
  order: IOrder | null;
  orders: IOrder[];
  userOrders: any[];
  isLoading: boolean;
  updatedOrder: any;
  deletedOrder: any;
  createdOrder: any;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  wards: any[];
  orderInfo: any; // Define a more specific type if possible
  confirmOrder: any
}

const initialState: IOrderState = {
  provinces: [],
  districts: [],
  wards: [],
  order: null,
  userOrders: [],
  orders: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  updatedOrder: null,
  deletedOrder: null,
  createdOrder: null,
  orderInfo: null,
  confirmOrder: null,
  message: "",
};

export const getOrders = createAsyncThunk("orders", async (_, thunkApi) => {
  try {
    return await orderServices.getOrders();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const confirmOrderByAdmin = createAsyncThunk("orders/confirm-order", async (orderId: string, thunkApi) => {
  try {
    return await orderServices.confirmOrder(orderId);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getOrdersByUser = createAsyncThunk(
  "orders/users",
  async (id: string, thunkApi) => {
    try {
      return await orderServices.getOrdersByUser(id);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// Fetch all provinces
export const getAllProvinces = createAsyncThunk(
  "provinces/getAllProvinces",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:8080/api/provinces");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch provinces"
      );
    }
  }
);

// Fetch all districts based on province ID
export const getAllDistricts = createAsyncThunk(
  "districts/getAllDistricts",
  async (provinceId: string, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:8080/api/districts", {
        params: { province_id: provinceId },
      });
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch districts"
      );
    }
  }
);

// Fetch all wards based on district ID
export const getAllWards = createAsyncThunk(
  "wards/getAllWards",
  async (districtId: any, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:8080/api/wards", {
        params: { district_id: districtId },
      });
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch wards"
      );
    }
  }
);


export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order: any, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/order",
        order
      );
      localStorage.removeItem("cartItems");
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
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

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (orderId: string) => {
  const response = await orderServices.cancelOrder(orderId);
  return response.data; // Adjust based on your API response
});

export const updateOrderQuantity = createAsyncThunk('orders/updateOrderQuantity', async ({ orderId, itemId, newQuantity }: { orderId: string; itemId: string; newQuantity: number }) => {
  const response = await orderServices.updateOrderQuantity(orderId, itemId, newQuantity);
  return response.data; // Adjust based on your API response
});


const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    setOrderInfo(state, action: PayloadAction<any>) {
      state.orderInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
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
      })
      .addCase(getAllProvinces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProvinces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.provinces = action.payload;
      })
      .addCase(getAllProvinces.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(getAllDistricts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDistricts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.districts = action.payload;
      })
      .addCase(getAllDistricts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getAllWards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllWards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wards = action.payload;
      })
      .addCase(getAllWards.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getOrdersByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrdersByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userOrders = action.payload;
      }).addCase(getOrdersByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(confirmOrderByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmOrderByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.confirmOrder = action.payload;
      })
      .addCase(confirmOrderByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { setOrderInfo } = orderSlice.actions;

export default orderSlice.reducer;
