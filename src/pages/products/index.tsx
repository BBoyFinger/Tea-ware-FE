import { useState, useEffect } from "react";
import { ICategory } from "../../types/category.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getCategories } from "../../features/category/categorySlice";
import { getProductByCategory, getProducts } from "../../features/product/productSlice";
import ProductsList from "../../components/ProductList";

const ProductListingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const dispatch: AppDispatch = useDispatch();

  const categoryState = useSelector((state: RootState) => state.categoryReducer);
  const productState = useSelector((state: RootState) => state.productReducer);

  const { categories } = categoryState;
  const { products, productByCategory } = productState;

  useEffect(() => {
    dispatch(getCategories(""));
    dispatch(getProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory("All");
      dispatch(getProductByCategory(categories[0].name as string));
    }
  }, [categories, dispatch]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    dispatch(getProductByCategory(categoryName));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handlePriceFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    dispatch(getProducts({ minPrice: min, maxPrice: max }));
  };

  const filteredAndSortedProducts = (selectedCategory === "All" ? products : productByCategory)
    .filter((product: any) => {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      return product.price >= min && product.price <= max;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "price") {
        return a.price - b.price;
      } else if (sortBy === "productName") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

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
                <div className="clear-both w-full h-[1px] my-12 bg-[#d7d9dd]"></div>
              </>
            ) : (
              ""
            )
          )}
        </div>
        <div className="flex flex-col md:flex-row">
          <aside
            className={`w-full md:w-64 bg-white rounded-lg shadow-md mb-4 md:mb-0 md:mr-4 transition-all duration-300`}
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
            </div>

            <div className="mb-4">
              <label htmlFor="minPrice" className="mr-2">
                Min Price:
              </label>
              <input
                type="number"
                id="minPrice"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="py-2 px-4 rounded border border-gray-300"
                placeholder="$"
              />
              <label htmlFor="maxPrice" className="ml-4 mr-2">
                Max Price:
              </label>
              <input
                type="number"
                id="maxPrice"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="py-2 px-4 rounded border border-gray-300"
                placeholder="$"
              />
              <button
                onClick={handlePriceFilter}
                className="ml-4 py-2 px-4 bg-blue-500 text-white rounded"
              >
                Apply
              </button>
            </div>

            <div className="">
              {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 ? (
                <ProductsList products={filteredAndSortedProducts} />
              ) : (
                <div className="p-2 bg-white text-black">No products available</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductListingPage;