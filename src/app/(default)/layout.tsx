import { Footer } from "@/components/footer";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col px-2 py-2 gap-y-2">
      <main className="flex-1 ">{children}</main>
      <Footer />
    </div>
  );
}
