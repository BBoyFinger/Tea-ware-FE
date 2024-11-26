/* eslint-disable jsx-a11y/heading-has-content */

import { IProduct } from "../types/product.types";
import { Link } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import scrollTop from "../utils/scrollTop";

type Props = {
  title: String;
  products: IProduct[];
  isLoading: Boolean;
  handleAddToCart: (id: any) => void;
};

const SpecialProduct = ({
  title,
  products,
  isLoading,
  handleAddToCart,
}: Props) => {
  return (
    <section className="bg-white ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-[10px] ">
          <Link
            to="/products"
            className="text-3xl font-light capitalize cursor-pointer hover:underline"
          >
            <h2>{title}</h2>
          </Link>
          <Link
            to={`/products`}
            className="text-3xl font-light text-[#a66920] uppercase cursor-pointer hover:underline"
          >
            <h2>View More</h2>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
          {isLoading
            ? products.map((product) => (
                <>
                  <Link
                    to={`/products/${product._id}`}
                    onClick={scrollTop}
                    className="transition-transform duration-300 transform hover:scale-105 cursor-pointer h-36 bg-white"
                  >
                    <div className="bg-slate-200 h-full p-5 min-w-[120px] md:min-w-[145px] animate-pulse"></div>
                    <div className="p-4 bg-slate-100 h-20 w-full grid gap-2">
                      <h2 className="capitalize p-1 bg-slate-200 animate-pulse"></h2>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between bg-slate-200 p-1 ">
                          <p className="text-[#a66920] animate-pulse font-semibold text-sm p-1"></p>
                        </div>
                        <div className="flex items-center p-1">
                          <p className="text-sm text-gray-500 font-medium p-1 bg-slate-200 animate-pulse"></p>
                          <p className="ml-2 text-sm text-gray-500 font-medium p-1 bg-slate-200 animate-pulse"></p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              ))
            : products.map((product) => (
                <div className="relative transition-transform duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full cursor-pointer z-50">
                    <LuShoppingCart
                      className="w-5 h-5"
                      onClick={() => handleAddToCart(product._id)}
                    />
                  </div>
                  <Link
                    onClick={scrollTop}
                    to={`/products/${product._id}`}
                    className="transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <img
                      src={product.images && product.images[0]?.url}
                      alt={product.images && product.images[0]?.title}
                      className="w-[full] h-auto object-contain mb-2"
                    />
                    <h2 className="capitalize">{product.productName}</h2>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-between">
                        <p className="text-[#a66920] font-semibold text-sm">
                          {product.discount && product.discount > 0 ? (
                            <p className="text-[#a66920] font-semibold text-sm">
                              Sale: $
                              {product.price &&
                                product.price -
                                  product.price * (product.discount / 100)}
                            </p>
                          ) : (
                            <p className="text-[#a66920] font-semibold text-sm">
                              Only ${product.price}
                            </p>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500 font-medium">
                          Rating: {product.averageRating} / 5
                        </p>
                        <p className="ml-2 text-sm text-gray-500 font-medium">
                          ({product.reviewsCount} reviews)
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialProduct;
