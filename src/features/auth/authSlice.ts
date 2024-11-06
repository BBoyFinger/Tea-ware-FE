import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user.types";
import authService from "./authService";

interface ProductCartItem {
  quantity: number;
  productId: {
    price: number;
  };
}

interface AuthState {
  user: User | null;
  searchField: {
    name: string;
    email: string;
    role: string;
  };
  users: User[];
  isLoading: boolean;
  userAddToCartCount: {
    count: number;
  };
  productsCart: ProductCartItem[];
  updatedUser: any;
  addToCart: [];
  deleteUser: any;
  deletedCartProduct: any;
  updateCartProduct: any;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: AuthState = {
  user: null,
  users: [],
  searchField: {
    name: "",
    email: "",
    role: "",
  },
  isLoading: false,
  isError: false,
  isSuccess: false,
  deleteUser: null,
  updatedUser: null,
  updateCartProduct: null,
  deletedCartProduct: null,
  addToCart: [],
  userAddToCartCount: {
    count: 0,
  },
  productsCart: [],
  message: "",
};

export const resetState = createAction("Reset_all");

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    passwordData: { currentPassword: string; newPassword: string },
    thunkApi
  ) => {
    try {
      return await authService.changePassword(passwordData);
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getAllUser = createAsyncThunk("users", async (_, thunkApi) => {
  try {
    return await authService.getAllUser();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const searchUser = createAsyncThunk(
  "search-user",
  async (searchParams: any, thunkApi) => {
    try {
      return await authService.searchUser(searchParams);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addCart = createAsyncThunk(
  "addToCart",
  async (productId: string, thunkApi) => {
    try {
      return await authService.addToCart(productId);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const userAddCartCountNumber = createAsyncThunk(
  "userAddToCart",
  async (_, thunkApi) => {
    try {
      return await authService.userAddToCart();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateCartProduct = createAsyncThunk(
  "userUpdateProductToCart",
  async (
    { productId, newQuantity }: { productId: string; newQuantity: number },
    thunkApi
  ) => {
    try {
      return await authService.updateCartProduct(productId, newQuantity);
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const viewProductCart = createAsyncThunk(
  "userViewProductToCart",
  async (_, thunkApi) => {
    try {
      return await authService.viewProductCart();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update-user",
  async (dataUser: any, thunkApi) => {
    try {
      return await authService.updateUserRole(dataUser);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteUsers = createAsyncThunk(
  "delete-user",
  async (ids: string[], thunkApi) => {
    try {
      return await authService.deleteUsers(ids);
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteCartProduct = createAsyncThunk(
  "delete-product-cart",
  async (id: string, thunkApi) => {
    try {
      return await authService.deleteCartProduct(id);
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
    setSearchField: (state, action) => {
      state.searchField = { ...state.searchField, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getAllUser.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(deleteUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.deleteUser = action.payload;
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(addCart.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.addToCart = action.payload;
      })
      .addCase(addCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(userAddCartCountNumber.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(userAddCartCountNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.userAddToCartCount = action.payload;
      })
      .addCase(userAddCartCountNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(viewProductCart.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewProductCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.productsCart = action.payload;
      })
      .addCase(viewProductCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(updateCartProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateCartProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updateCartProduct = action.payload;
      })
      .addCase(updateCartProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(deleteCartProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteCartProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.deletedCartProduct = action.payload;
      })
      .addCase(deleteCartProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(searchUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.users = action.payload;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Password changed successfully!";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message =
          (action.payload as string) || "Failed to change password";
      })

      .addCase(resetState, () => initialState);
  },
});

export const { setUserDetails, setSearchField } = authSlice.actions;

export default authSlice.reducer;
