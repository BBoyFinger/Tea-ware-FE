import { ICategory } from "./category.types";

export interface IProduct {
  _id?: string;
  productName?: string;
  description?: string;
  price?: number;
  quantity?: number;
  images?: { url: string; title: string }[];
  category?: ICategory; // Use the ICategory type
  material?: string;
  stockQuantity?: number;
  availability?: string;
  averageRating?: number;
  reviewsCount?: number;
  reviews?: {
    user: string;
    rating: number;
    comment: string;
  }[];
  discount?: number;
  isFeatured?: boolean;
  brand?: string;
}
