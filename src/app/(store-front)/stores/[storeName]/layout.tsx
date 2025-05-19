import { StoreNavbar } from "./_components/store-navbar";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <StoreNavbar />
      {children}
    </div>
  );
}
