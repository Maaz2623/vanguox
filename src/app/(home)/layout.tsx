import { Navbar } from "@/modules/home/ui/components/navbar";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <div className="absolute inset-0 -z-10 w-full min-h-full h-full bg-background dark:bg-[radial-gradient(#393E4A_1px,transparent_1px)] bg-[radial-gradient(#d4d2cd_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="px-8 pb-4 flex flex-1 flex-col">
        <Navbar />
        {children}
      </div>
    </main>
  );
}
