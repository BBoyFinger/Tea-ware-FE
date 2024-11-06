import { useState, useEffect } from "react";

import { ICategory } from "../../types/category.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getCategories } from "../../features/category/categorySlice";
import {
  getProductByCategory,
  getProducts,
} from "../../features/product/productSlice";

import ProductsList from "../../components/ProductList";

const ProductListingPage = () => {
  // const [categories, setCategories] = useState<ICategory[]>([]);
  // State để lưu danh mục đã chọn
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [productName, setProductName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const dispatch: AppDispatch = useDispatch();

  const categoryState = useSelector(
    (state: RootState) => state.categoryReducer
  );
  const productState = useSelector((state: RootState) => state.productReducer);

  const { categories } = categoryState;
  const { products, productByCategory } = productState;

  const filter = {
    productName: productName,
    minPrice: minPrice,
    maxPrice: maxPrice,
  };

  useEffect(() => {
    dispatch(getCategories(""));
    dispatch(getProducts(filter));
  }, [dispatch]);

  // Cập nhật selectedCategory khi categories thay đổi
  useEffect(() => {
    if (categories.length > 0) {
      const firstCategory = categories[0].name; // Lấy tên danh mục đầu tiên
      setSelectedCategory("All"); // Cập nhật selectedCategory
      dispatch(getProductByCategory(firstCategory as string)); // Lấy sản phẩm theo danh mục đầu tiên
    }
  }, [categories, dispatch]); // Chạy effect này khi categories thay đổi

  const handleSortChange = (e: any) => {
    const { value } = e.target;
    if (value === "asc") {
    }
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    dispatch(getProductByCategory(categoryName)); // Gọi API để lấy sản phẩm theo danh mục
  };

  // const filteredProducts = products
  //   .filter(
  //     (product: IProduct) =>
  //       (selectedCategory === "All" || product.category === selectedCategory) &&
  //       product.price >= priceRange[0] &&
  //       product.price <= priceRange[1]
  //   )
  //   .sort((a: any, b: any) => {
  //     if (sortBy === "price") {
  //       return a.price - b.price;
  //     } else if (sortBy === "name") {
  //       return a.name.localeCompare(b.name);
  //     }
  //     return 0;
  //   });

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div>
          {categories.map((category: ICategory) =>
            selectedCategory === category.name ? (
              <>
                <div className="flex flex-col gap-3">
                  <h1 className="font-semibold text-3xl">{category.name}</h1>
                  <p className="text-lg">{category.description}</p>
                </div>
                <div className=" clear-both w-full h-[1px] my-12 bg-[#d7d9dd]"></div>
              </>
            ) : (
              ""
            )
          )}
        </div>
        <div className="flex flex-col md:flex-row">
          <aside
            className={`w-full md:w-64 bg-white  rounded-lg shadow-md mb-4 md:mb-0 md:mr-4 transition-all duration-300`}
          >
            <button
              className="md:hidden w-full bg-blue-500 text-white py-2 px-4 rounded mb-4"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "Close Categories" : "Open Categories"}
            </button>
            <h2 className="text-xl p-4 font-semibold hidden lg:block">
              Categories
            </h2>
            <div
              className={`max-h-60 md:max-h-[300px] lg:max-h-full overflow-auto lg:overflow-hidden transition-all duration-300 ${
                isSidebarOpen ? "h-auto" : "h-0 lg:h-full md:h-full"
              }`}
            >
              <ul>
                <li className="mb-2">
                  <button
                    className={`w-full text-left py-2 px-4 ${
                      selectedCategory === "All"
                        ? "bg-[#eee] text-[#666] border-l-4 border-solid border-[#7E792A]"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleCategoryChange("All")}
                  >
                    All
                  </button>
                </li>
                {categories.map((category: ICategory) => (
                  <li key={category._id} className="mb-2">
                    <button
                      className={`w-full text-left py-2 px-4 ${
                        selectedCategory === category.name
                          ? "bg-[#eee] text-[#666] border-l-4 border-solid border-[#7E792A]"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        category.name && handleCategoryChange(category.name)
                      }
                    >
                      {category.name || "Unknown Category"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="flex-grow">
            <div className="mb-4 flex flex-wrap items-center justify-between">
              <div className="w-full md:w-auto mb-4 md:mb-0">
                <label htmlFor="sort" className="mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="py-2 px-4 rounded border border-gray-300"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <div className="w-full md:w-auto">
                <form>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="sortBy"
                      value={"asc"}
                      onChange={handleSortChange}
                    />
                    <label htmlFor="">Price - Low to High</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="sortBy"
                      value={"dsc"}
                      onChange={handleSortChange}
                    />
                    <label htmlFor="">Price - High to Low</label>
                  </div>
                </form>
              </div>
            </div>

            <div className="">
              {products && products.length > 0 ? (
                selectedCategory === "All" ? (
                  // Hiển thị tất cả sản phẩm khi chọn "All"
                  <ProductsList products={products} />
                ) : productByCategory && productByCategory.length > 0 ? (
                  // Hiển thị sản phẩm theo danh mục nếu có sản phẩm thuộc danh mục
                  <ProductsList products={productByCategory} />
                ) : (
                  // Nếu không có sản phẩm thuộc danh mục, hiển thị thông báo
                  <div>No products available in this category</div>
                )
              ) : (
                // Nếu không có sản phẩm nào, hiển thị thông báo
                <div>No products available</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductListingPage;
