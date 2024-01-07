// loader animation
import React from "react";
import { ScaleLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ScaleLoader size={50} color="#000" />
    </div>
  );
};

export default Loader;
