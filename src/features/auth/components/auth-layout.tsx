import Image from "next/image";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href={`/`}
        >
          <Image src={`/logo.svg`} alt="Vanguox" width={30} height={30} />
          Vanguox
        </Link>
        {children}
      </div>
    </div>
  );
}
