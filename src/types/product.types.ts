export interface IProduct {
  _id?: string;
  productName?: string;
  description?: string;
  price?: number;
  quantity?: number;
  images?: { url: string; title: string }[];
  category?: {
    name: string;
    desription: string;
    productCount: 0;
  };
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
