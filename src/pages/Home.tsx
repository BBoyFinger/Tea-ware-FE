import React, { useContext, useEffect } from "react";

import { Link } from "react-router-dom";
import SpecialProduct from "../components/SpecialProduct";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeaturedProducts,
  getProductBestReviews,
  getProductBestSellers,
  getProductNewArrivals,
} from "../features/product/productSlice";

import { addCart } from "../features/auth/authSlice";

import Context from "../context";

type Props = {};

const Home = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const productState = useSelector((state: RootState) => state.productReducer);
  const authState = useSelector((state: RootState) => state.authReducer);

  const {
    bestReviewProduct,
    bestSellerProduct,
    featuredProduct,
    newArrivalProduct,
    isLoading,
  } = productState;

  const { addToCart, isError, isSuccess } = authState;
  const context = useContext(Context);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getProductBestSellers());
    dispatch(getProductBestReviews());
    dispatch(getProductNewArrivals());
  }, [dispatch]);

  const categories = [
    {
      name: "Tea Sets",
      image:
        "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      name: "Teapots",
      image:
        "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    {
      name: "Tea Cups",
      image:
        "https://www.adagio.com/images5/products_index_retina/spiced_blood_orange.jpg",
    },
    {
      name: "Accessories",
      image:
        "https://www.adagio.com/images5/products_index_retina/pu_erh_coffee.jpg",
    },
  ];

  const handleAddToCart = async (productId: string) => {
    await dispatch(addCart(productId));
    await context?.fetchUserAddToCart();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Section */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.adagio.com/images5/front_page/2024_pu_erh_coffee_bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Exquisite Teaware
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Elevate Your Tea Experience
            </p>
            <Link to="products">
              <button className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Easy to Find Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Easy to Find</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover transition duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {[
        { products: bestReviewProduct, title: "Best Reviewed" },
        { products: newArrivalProduct, title: "Newest Additions" },
        { products: bestSellerProduct, title: "Best Sellers" },
        { products: featuredProduct, title: "Featured Product" },
      ].map(
        (item, index) =>
          item.products?.length > 0 && (
            <div key={index}>
              <div className="container clear-both w-full h-[1px] my-[20px] bg-[#d7d9dd]"></div>
              <SpecialProduct
                products={item.products}
                title={item.title}
                isLoading={isLoading}
                handleAddToCart={handleAddToCart}
              />
            </div>
          )
      )}
      <div className="container clear-both w-full h-[1px] my-[20px] bg-[#d7d9dd]"></div>
    </div>
  );
};

export default Home;
