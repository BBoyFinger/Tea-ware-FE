import React from "react";
import { Link } from "react-router-dom";
import scrollTop from "../utils/scrollTop";

type RelatedProduct = {
  _id: string;
  productName: string;
  price: number;
  images: {
    url: string;
    title: string;
  }[];
};

type Props = {
  relatedProducts: RelatedProduct[];
};

const RelatedProducts = ({ relatedProducts }: Props) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {relatedProducts.map((relatedProduct) => (
          <Link
            to={`/products/${relatedProduct._id}`}
            key={relatedProduct._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            onClick={scrollTop}
          >
            <img
              src={relatedProduct.images[0]?.url}
              alt={relatedProduct?.images[0]?.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2">
                  {relatedProduct.productName}
                </h3>
                <p className="text-gray-600 mb-4">${relatedProduct.price}</p>
              </div>
              <button className="bg-[#f04138] text-white px-4 py-2 rounded-md hover:bg-[#f04138] transition-colors w-full">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
