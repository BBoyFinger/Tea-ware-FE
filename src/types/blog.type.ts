export interface IBlog {
  _id?: string;
  title?: string;
  content?: string;
  author?: {
    name: string;
    pictureImg: string;
  };
  images?: {
    url: string;
    title: string;
  }[];
  createdAt?: string;
}
