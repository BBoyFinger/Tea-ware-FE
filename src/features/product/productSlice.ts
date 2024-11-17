import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { IProduct } from "../../types/product.types";
import { productService } from "./productService";
import axiosInstance from "../../utils/axiosConfig";

interface IProductState {
  product: IProduct | null;
  products: IProduct[];
  searchField: {
    productName: string;
    category: string;
    availability: string;
  };
  isLoading: boolean;
  searchProducts: [];
  totalPages: number;
  currentPage: number;
  productByCategory: any;
  updatedProduct: any;
  deletedProduct: any;
  createdProduct: any;
  bestReviewProduct: any;
  bestSellerProduct: any;
  newArrivalProduct: any;
  featuredProduct: any;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  totalProducts: number;
}

const initialState: IProductState = {
  product: null,
  products: [],
  productByCategory: [],
  searchField: {
    productName: "",
    category: "",
    availability: "",
  },
  isLoading: false,
  searchProducts: [],
  isError: false,
  isSuccess: false,
  updatedProduct: null,
  deletedProduct: null,
  createdProduct: null,
  bestReviewProduct: null,
  bestSellerProduct: null,
  featuredProduct: null,
  newArrivalProduct: null,
  message: "",
  totalProducts: 0,
  totalPages: 0,
  currentPage: 1,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page: number) => {
    const limit = page === 1 ? 15 : 1000; // First page 10, second page all remaining
    const response = await axiosInstance(`/products?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const getProducts = createAsyncThunk(
  "get-products",
  async (query: any, thunkApi) => {
    try {
      return await productService.getProducts(query);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getProductById = createAsyncThunk(
  "get-productById",
  async (id: string, thunkApi) => {
    try {
      return await productService.getProductById(id);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const searchProduct = createAsyncThunk(
  "search-product",
  async (query: string, thunkApi) => {
    try {
      return await productService.searchProducts(query);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getProductByCategory = createAsyncThunk(
  "get-productCategory",
  async (category: string, thunkApi) => {
    try {
      return await productService.getProductByCategory(category);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getProductBestReviews = createAsyncThunk(
  "get-productBestReviews",
  async (_, thunkApi) => {
    try {
      return await productService.getProductBestReviews();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getProductBestSellers = createAsyncThunk(
  "get-productBestSellers",
  async (_, thunkApi) => {
    try {
      return await productService.getProductBestSellers();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getProductNewArrivals = createAsyncThunk(
  "get-productNewArrivals",
  async (_, thunkApi) => {
    try {
      return await productService.getProductNewArrivals();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  "get-productFeatured",
  async (_, thunkApi) => {
    try {
      return await productService.getFeaturedProducts();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "create-Product",
  async (data: any, thunkApi) => {
    try {
      return await productService.createProduct(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "update-Product",
  async (data: IProduct, thunkApi) => {
    try {
      return await productService.editProduct(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "delete-Product",
  async (ids: string[], thunkApi) => {
    try {
      return await productService.deleteProduct(ids);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const resetProductState = createAction("Reset_product");

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setSearchField: (state, action) => {
      state.searchField = { ...state.searchField, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.products = action.payload;
        state.totalPages = action.payload.totalPages; // Tổng số trang
        state.currentPage = action.payload.currentPage; // Trang hiện tại
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.createdProduct = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(getProductByCategory.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.productByCategory = action.payload;
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.error.message as string;
      })
      .addCase(getProductById.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.error.message as string;
      })
      .addCase(getProductBestReviews.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductBestReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.bestReviewProduct = action.payload;
      })
      .addCase(getProductBestReviews.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.error.message as string;
      })
      .addCase(getProductBestSellers.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductBestSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.bestSellerProduct = action.payload;
      })
      .addCase(getProductBestSellers.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.error.message as string;
      })
      .addCase(getProductNewArrivals.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductNewArrivals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.newArrivalProduct = action.payload;
      })
      .addCase(getProductNewArrivals.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.error.message as string;
      })
      .addCase(getFeaturedProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.featuredProduct = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.error.message as string;
      })
      .addCase(searchProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.searchProducts = action.payload;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.error.message as string;
      }).addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message || '';
      })
      .addCase(resetProductState, () => initialState);
  },
});

export const { setSearchField } = productSlice.actions;

export default productSlice.reducer;
