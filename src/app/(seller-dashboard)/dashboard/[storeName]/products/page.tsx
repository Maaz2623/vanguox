import React from "react";
import { DataTable } from "./_components/data-table";
import data from "./_components/stores_mock_data.json";

const ProductsPage = async () => {
  return (
    <div>
      <DataTable data={data} />
    </div>
  );
};

export default ProductsPage;
