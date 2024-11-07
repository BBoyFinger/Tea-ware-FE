import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IOrder } from "../../types/order.type";
import { orderServices } from "./orderService";
import axios from "axios";

let config = {
  headers: {
    "Content-Type": "application/json",
    Token: "497989ae-9cc3-11ef-abbe-867a64c2e80d",
  },
};

interface IOrderState {
  provinces: any[];
  districts: any[];
  order: IOrder | null;
  orders: IOrder[];
  isLoading: boolean;
  updatedOrder: any;
  deletedOrder: any;
  createdOrder: any;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  wards: any[];
}

const initialState: IOrderState = {
  provinces: [],
  districts: [],
  wards: [],
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

export const getOrders = createAsyncThunk("orders", async (_, thunkApi) => {
  try {
    return await orderServices.getOrders();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// Fetch all provinces
export const getAllProvinces = createAsyncThunk(
  "provinces/getAllProvinces",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        config // Use the config with the token
      );
      return response.data;
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
    const newConfig = {
      headers: {
        Token: "497989ae-9cc3-11ef-abbe-867a64c2e80d", // Ensure this token is valid
      },
      params: {
        province_id: provinceId, // Send province_id as a query parameter
      },
    };

    try {
      const response = await axios.get(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
        newConfig // Use the newConfig with headers and params
      );
      return response.data;
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
  async (districtId: string, thunkAPI) => {
    const newConfig = {
      headers: {
        Token: "497989ae-9cc3-11ef-abbe-867a64c2e80d", // Ensure this token is valid
      },
      params: {
        district_id: districtId, // Send district_id as a query parameter
      },
    };

    try {
      const response = await axios.get(
        // Change to axios.get
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        newConfig // Use the newConfig with headers and params
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch wards"
      );
    }
  }
);
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
      });
  },
});

export default orderSlice.reducer;
