interface IOrderProduct {
  _id: string;
  quantity: number;
  price: number;
}

interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder {
  _id: string;
  user: string;
  products: IOrderProduct[];
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "Credit Card" | "PayPal" | "Cash On Delivery";
  createdAt?: Date;
  updatedAt?: Date;
  shippingAddress: IShippingAddress;
}
