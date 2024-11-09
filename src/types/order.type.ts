interface IOrderItem {
  product: string; // Assuming product is stored as an ObjectId string
  quantity: number;
  price: number;
}

interface IShippingAddress {
  province?: string;
  district?: string;
  ward?: string;
  detail?: string;
  name?: string;
  phone?: string;
}

interface IPaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

export interface IOrder {
  _id: string;
  user: string; // Assuming user is stored as an ObjectId string
  orderItems: IOrderItem[];
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "Credit Card" | "PayPal" | "Cash On Delivery";
  shippingAddress: IShippingAddress;
  paymentResult?: IPaymentResult;
  order_code?: string;
  to_ward_code?: string;
  to_district_id?: number;
  token?: string;
  cancelOrder?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}