import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categorySlice from "../features/category/categorySlice";
import productSlice from "../features/product/productSlice";
import blogSlice from "../features/blog/blogSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    categoryReducer: categorySlice,
    productReducer: productSlice,
    orderReducer: productSlice,
    blogReducer: blogSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
