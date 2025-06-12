import React from "react";
import { ChartDemo } from "./_components/chart-demo";
import { LongChart } from "./_components/long-chart";
const OverviewPage = async () => {

  


  return (
    <div className="gap-6 flex flex-col">
      <LongChart />
      <div className="flex flex-wrap gap-8">
        <div className="aspect-video w-[400px]">
          <ChartDemo />
        </div>
        <div className="aspect-video w-[400px]">
          <ChartDemo />
        </div>
        <div className="aspect-video w-[400px]">
          <ChartDemo />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
