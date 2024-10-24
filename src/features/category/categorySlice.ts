import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ICategory } from "../../types/category.types";
import { categoryService } from "./categoryService";

interface ICategoryState {
  category: ICategory | null;
  searchField: {
    categoryName: string;
  };
  categories: ICategory[];
  isLoading: boolean;
  updatedCategory: any;
  deletedCategory: any;
  createdCategory: any;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: ICategoryState = {
  category: null,
  categories: [],
  searchField: {
    categoryName: "",
  },
  isLoading: false,
  isError: false,
  isSuccess: false,
  updatedCategory: null,
  deletedCategory: null,
  createdCategory: null,
  message: "",
};

export const resetCategoryState = createAction("Reset_categoryState");

export const getCategories = createAsyncThunk(
  "categories",
  async (params: any, thunkApi) => {
    try {
      return await categoryService.getCategories(params);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createCategory = createAsyncThunk(
  "create-Category",
  async (data: ICategory, thunkApi) => {
    try {
      return await categoryService.createCategory(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "update-Category",
  async (data: ICategory, thunkApi) => {
    try {
      return await categoryService.editCategory(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "delete-Category",
  async (ids: string[], thunkApi) => {
    try {
      return await categoryService.deleteCategory(ids);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
    setSearchField: (state, action) => {
      state.searchField = { ...state.searchField, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.createdCategory = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedCategory = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message as string;
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isError = false;
        state.deletedCategory = action.payload;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error.message as string;
      })
      .addCase(resetCategoryState, () => initialState);
  },
});

export const { setSearchField } = categorySlice.actions;
export default categorySlice.reducer;
