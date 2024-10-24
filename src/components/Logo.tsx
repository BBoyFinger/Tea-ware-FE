import React from "react";
import logoImage from "../assets/logo.svg";

interface LogoPropsType {
  width: number;
  height: number;
}

const Logo: React.FC<LogoPropsType> = ({ width, height }) => {
  return (
    <div className="hidden xl:flex">
      <img
        src={logoImage}
        alt="logo"
        className="object-contain"
        width={width}
        height={height}
      />
    </div>
  );
};

export default Logo;
