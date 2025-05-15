import { Navbar } from "./_components/navbar";

export default async function VanguoxFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
