import { Navbar } from "@/components/navbar";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-2 py-2 flex flex-col gap-y-2">
      <Navbar /> {children}
    </div>
  );
}
