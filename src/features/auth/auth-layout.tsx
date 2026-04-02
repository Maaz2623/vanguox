export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white dark:bg-black">
      {/* Background */}
      <div
        className="absolute inset-0
        bg-[radial-gradient(circle,_rgba(0,0,0,0.15)_1px,_transparent_1px)]
        dark:bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)]
        [background-size:20px_20px]"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl flex justify-center">
        {children}
      </div>
    </div>
  );
}
