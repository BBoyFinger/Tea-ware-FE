import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.svg";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { getBlog } from "../features/blog/blogSlice";
import moment from "moment";
import { Link } from "react-router-dom";
import scrollTop from "../utils/scrollTop";

type Props = {};

const links = [
  {
    title: "Categories",
    items: [
      { name: "Tea", href: "#" },
      { name: "TeaWear", href: "#" },
      { name: "Blends", href: "#" },
      { name: "Gifts", href: "#" },
      { name: "Gift Certification", href: "#" },
      { name: "Pantry", href: "#" },
    ],
  },
  {
    title: "Shop",
    items: [
      { name: "Shipping", href: "#" },
      { name: "Best Sellers", href: "#" },
      { name: "Best Reviewed", href: "#" },
      { name: "New Arrivals", href: "#" },
      { name: "Advanced Search", href: "#" },
      { name: "Helping you Decide", href: "#" },
      { name: "Teavana Alternatives", href: "#" },
      { name: "Davids Tea Alternatives", href: "#" },
    ],
  },
  {
    title: "Learn",
    items: [
      { name: "Our Story", href: "#" },
      { name: "Tea Info", href: "#" },
      { name: "Carbon Offset", href: "#" },
      { name: "Roots Campaign", href: "#" },
      { name: "Tea Blog", href: "#" },
      { name: "FAQs", href: "#" },
    ],
  },
  {
    title: "Adadagiogio teas",
    items: [
      { name: "Join Our Mailing List", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Stores", href: "#" },
      { name: "Media / Press", href: "#" },
      { name: "Wholesale", href: "#" },
      { name: "Help / Contact", href: "#" },
    ],
  },
  {
    title: "Tea Blog",
    items: [{ name: "Blog", href: "#" }],
  },
];

const Footer = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const blogState = useSelector((state: RootState) => state.blogReducer.blogs);

  useEffect(() => {
    dispatch(getBlog(""));
  }, [dispatch]);
  return (
    <>
      <footer id="footer" className="bg-[#a66920] md:bg-transparent pb-[20px]">
        <div className="pt-0 lg:pt-[75px] md:pt-[125px]">
          <div className="container grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
            {links.map((section) => (
              <div key={section.title}>
                {section.title === "Tea Blog" ? (
                  <>
                    <h2 className="text-[14px] text-white lg:text-[15px] pt-[15px] md:pt-0 md:pb-[20px] lg:pt-0 lg:pb-[20px] leading-5 font-semibold md:text-[#7E792A] lg:text-[#7E792A] uppercase">
                      {section.title}
                    </h2>
                    <div>
                      {/* {blogState.map((blog) => (
                        <>
                          {blog.images && blog.images.length > 0 && (
                            <Link to={`/blog/${blog._id}`}>
                              <img
                                src={blog.images[0].url && blog.images[0].url}
                                alt={blog.title}
                                className="w-full h-auto rounded-lg"
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-[#a66920]">
                                  {blog.title?.substring(0, 20)} ...
                                </span>
                                <span className="text-sm">
                                  {moment(blog.createdAt).format("LL")}
                                </span>
                              </div>
                            </Link>
                          )}
                        </>
                      ))} */}
                      {blogState[0]?.images &&
                        blogState[0]?.images.length > 0 && (
                          <Link
                            to={`/blog/${blogState[0]._id}`}
                            onClick={scrollTop}
                          >
                            <img
                              src={
                                blogState[0]?.images[0].url &&
                                blogState[0]?.images[0].url
                              }
                              alt={blogState[0].title}
                              className="w-full h-auto rounded-lg"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#a66920]">
                                {blogState[0].title?.substring(0, 20)} ...
                              </span>
                              <span className="text-sm">
                                {moment(blogState[0].createdAt).format("LL")}
                              </span>
                            </div>
                          </Link>
                        )}
                    </div>
                  </>
                ) : (
                  <>
                    <ul className="inline text-black text-sm leading-[1.2em] pr-[10px] pb-[7px]">
                      {section.items.map((item) => (
                        <li
                          key={item.name}
                          className="inline-block pb-0 pr-[10px] text-white md:text-[12px] md:pb-[10px] lg:pb-[7px] md:text-black md:leading-5 md:block text-[12px] lg:text-[14px]"
                        >
                          <a href={item.href}>{item.name}</a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </footer>
      {/* Carbon offset */}
      <div
        tabIndex={0}
        id="carbonOffset"
        className="hidden lg:block md:block bg-custom-fall w-full h-[225px] bg-[center_bottom] md:bg-contain lg:bg-contain"
      >
        <div></div>
      </div>

      {/* satellites */}
      <div id="satellites" className="bg-[#37372d] pt-[10px] ">
        <div className="container flex items-center flex-col">
          <div className="text-white">
            <img
              src={logo}
              alt="logo"
              className="object-contain w-20 h-20 bg-white"
            />
          </div>

          {/* Line */}
          <div className="opacity-20 clear-both w-full h-[1px] my-[20px] bg-[#d7d9dd]"></div>

          <div className="lg:w-[calc(100%-100px)] px-[20px] pb-[30px] lg:px-[50px] lg:pb-[30px] max-w-[850px] mx-auto flex justify-between items-center gap-5">
            <div>
              <p className="text-[13px] text-white opacity-[0.8] ">
                @Teaware - copyright {new Date().getFullYear()}
              </p>
            </div>
            <div className="hidden lg:flex text-white opacity-[0.8]">
              <div className="cursor-pointer mx-5">
                <a href="/#">
                  <FaFacebookF className="w-[20px] h-[20px]" />
                </a>
              </div>
              <div className="cursor-pointer mx-5">
                <a href="/#">
                  <FaTwitter className="w-[20px] h-[20px]" />
                </a>
              </div>
              <div className="cursor-pointer mx-5">
                <a href="/#">
                  <FaInstagram className="w-[20px] h-[20px]" />
                </a>
              </div>
              <div className="cursor-pointer mx-5">
                <a href="/#">
                  <FaYoutube className="w-[20px] h-[20px]" />
                </a>
              </div>
              <div className="cursor-pointer mx-5">
                <a href="/#">
                  <FaPinterest className="w-[20px] h-[20px]" />
                </a>
              </div>
              <div className="cursor-pointer mx-5">
                <a href="/#">
                  <FaTiktok className="w-[20px] h-[20px]" />
                </a>
              </div>
            </div>
            <div className="text-white opacity-[0.8] hover:text-[#a66920] duration-75 transition-all	text-[13px]">
              <a href="/#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
