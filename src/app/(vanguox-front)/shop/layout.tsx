import { Navbar } from "../_components/navbar";

export default async function VanguoxFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="px-3 py-3">{children}</div>
    </div>
  );
}
