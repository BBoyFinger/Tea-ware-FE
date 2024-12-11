import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../types/product.types";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { addCart, viewProductCart } from "../features/auth/authSlice";
import Context from "../context";
import scrollTop from "../utils/scrollTop";

const ProductsList: React.FC<{ products: IProduct[] }> = ({ products }) => {
  const dispatch: AppDispatch = useDispatch();

  const context = useContext(Context);

  const handleAddToCart = async (productId: string) => {
    await dispatch(addCart(productId));
    context?.fetchUserAddToCart();
    await dispatch(viewProductCart());
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105"
        >
          <div className="p-4">
            <Link to={`/products/${product._id}`} onClick={scrollTop}>
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].title}
                  className="w-full h-48 object-fill mb-2"
                />
              )}
              <h3 className="text-base capitalize font-medium mb-1">
                {product.productName}
              </h3>
              {product.discount !== 0 && product.discount ? (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[#a66920]  font-semibold text-sm">
                      Sale: $
                      {product.price &&
                        product.price -
                          product.price * (product.discount / 100)}
                    </p>
                    <div>
                      {product.availability === "In Stock" ? (
                        <div className="text-[#3c9342] text-sm">
                          {product.availability}
                        </div>
                      ) : (
                        <div className="text-red-500 text-sm">
                          {product.availability}
                        </div>
                      )}
                    </div>
                    {/* <div className="flex items-center mb-2">
                      <p className="text-sm text-gray-500 font-medium">
                        Rating: {product.averageRating} / 5
                      </p>
                      <p className="ml-2 text-sm text-gray-500 font-medium">
                        ({product.reviewsCount} reviews)
                      </p>
                    </div> */}
                  </div>
                </>
              ) : null}
              {!product.discount && (
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[#a66920] font-semibold text-sm">
                    only ${product.price}
                  </p>
                  <div>
                    {product.availability === "In Stock" ? (
                      <div className="text-[#3c9342] text-sm">
                        {product.availability}
                      </div>
                    ) : (
                      <div className="text-red-500 text-sm">
                        {product.availability}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Link>

            <button
              className="bg-[#f05338] w-full text-white py-2 px-4 rounded hover:bg-[#f04138] transition-colors duration-300 z-50"
              onClick={() => handleAddToCart(product._id || "")}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
