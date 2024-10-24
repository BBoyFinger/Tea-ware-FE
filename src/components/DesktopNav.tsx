import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const DesktopNav = (props: Props) => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Collections", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <div className="bg-[#db8f32]">
      <nav className="shadow-2xl text-white">
        <ul className="hidden lg:flex flex-row justify-center items-center gap-4 text-base">
          {navLinks.map((link) => (
            <li key={link.path} className="py-[10px] px-3 text-xl">
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DesktopNav;
