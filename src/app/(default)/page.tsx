import React from "react";
import { ProductsContainer } from "./_components/products-container";

const HomePage = async () => {
  return (
    <div className="flex gap-x-2">
      <div className="w-[20vw] bg-white rounded-lg border" />
      <div className="w-full">
        <ProductsContainer />
      </div>
    </div>
  );
};

export default HomePage;
