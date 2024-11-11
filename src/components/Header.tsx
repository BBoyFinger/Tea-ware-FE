import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setUserDetails, viewProductCart } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { ROLE } from "../utils/User";
import Context from "../context";
import Cart from "./ShoppingCart";
import ProductSearch from "./SearchProduct";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import { PiUserCircleLight } from "react-icons/pi";
import axiosInstance from "../utils/axiosConfig";

const Header = () => {
  const userState = useSelector((state: RootState) => state.authReducer);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Context);

  const { user, productsCart } = userState;

  const handleLogout = async () => {
    const response = await axiosInstance.get("/logout");

    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(setUserDetails(null));
    }

    if (response.data.error) {
      toast.error(response.data.message);
    }
    navigate("/login");
  };

  useEffect(() => {
    dispatch(viewProductCart());
    context?.fetchUserAddToCart();
  }, [dispatch]);

  return (
    <header className="shadow-2xl bg-[#db8f32]">
      <div className="container h-full text-white">
        {/* Mobile */}
        <div className="lg:hidden pt-1 pb-3">
          <div className="flex justify-between items-center mt-2">
            <MobileNav />
            <div>
              <Link to="/" className="flex items-center">
                <Logo width={100} height={100} />
                <span className="text-2xl font-semibold uppercase md:inline-block">
                  Teaware Shop
                </span>
              </Link>
            </div>

            <div className="text-2xl relative cursor-pointer">
              <Cart
                count={context?.userAddToCartCount?.count}
                userId={user?._id}
                products={productsCart}
                viewProductCart={viewProductCart}
              />
            </div>
          </div>
          {/* Search */}
          <div>
            <ProductSearch />
          </div>
        </div>

        {/* Desktop */}
        <div>
          <div className="hidden lg:flex justify-between items-center pt-2">
            <div>
              <Link to="/" className="flex items-center">
                <Logo width={80} height={80} />
                <span className="text-xl font-semibold uppercase md:inline-block">
                  Teaware Shop
                </span>
              </Link>
            </div>

            <div>
              <ProductSearch />
            </div>
            {/* Cart User */}
            <div className="hidden sm:flex gap-4 items-center justify-center">
              <div>
                {/* User */}
                <Menu as={"div"} className="relative text-left">
                  <div className="flex items-center">
                    {user?.pictureImg ? (
                      <MenuButton className="cursor-pointer text-3xl">
                        <img
                          src={user?.pictureImg}
                          className="w-10 h-10 rounded-full"
                          alt={user?.name}
                        />
                      </MenuButton>
                    ) : (
                      <div className="cursor-pointer text-3xl">
                        <PiUserCircleLight />
                      </div>
                    )}
                  </div>
                  <MenuItems
                    transition
                    className="absolute left-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
                  >
                    <div className="py-1">
                      <nav>
                        {user?.role === ROLE.ADMIN ? (
                          <>
                            <Link
                              to={"/admin-panel"}
                              className="block px-4 py-2 hover:bg-slate-300 text-sm text-gray-700"
                            >
                              Admin Panel
                            </Link>
                            <Link
                              to={"/myOrder"}
                              className="block px-4 py-2 hover:bg-slate-300 text-sm text-gray-700"
                            >
                              MyOrder
                            </Link>
                          </>
                        ) : user?.role === ROLE.CUSTOMER ? (
                          <>
                            <Link
                              to={"/myProfile"}
                              className="block px-4 py-2 hover:bg-slate-300 text-sm text-gray-700"
                            >
                              Profile
                            </Link>
                            <Link
                              to={"/myOrder"}
                              className="block px-4 py-2 hover:bg-slate-300 text-sm text-gray-700"
                            >
                              MyOrder
                            </Link>
                            <Link
                              to={"/changePassword"}
                              className="block px-4 py-2 hover:bg-slate-300 text-sm text-gray-700"
                            >
                              Change Password
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                      </nav>
                    </div>
                  </MenuItems>
                </Menu>
              </div>

              {/* Cart*/}
              <div className="text-2xl relative cursor-pointer">
                <Cart
                  count={context?.userAddToCartCount.count}
                  userId={user?._id}
                  products={productsCart}
                  viewProductCart={viewProductCart}
                />
              </div>
              <div>
                {user?._id ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-slate-300 rounded-full font-bold bg-[#bd3030] hover:opacity-[0.9] text-white"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to={"/login"}
                    className="px-4 py-2 hover:bg-slate-300 rounded-full font-bold bg-[#bd3030] hover:opacity-[0.9] text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
          <DesktopNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
