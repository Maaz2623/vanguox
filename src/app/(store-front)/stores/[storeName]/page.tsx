import StoreFrontLayout from "@/modules/store-front/store-front-layout";
import StoreFrontPage from "@/modules/store-front/store-front-page";

export default async function StoreLayout() {
  return (
    <StoreFrontLayout>
      <StoreFrontPage />
    </StoreFrontLayout>
  );
}
