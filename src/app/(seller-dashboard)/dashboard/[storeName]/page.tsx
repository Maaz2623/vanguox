import React from "react";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

const OverviewPage = async ({ params }: PageProps) => {
  return <div>OverviewPage: {(await params).storeName}</div>;
};

export default OverviewPage;
