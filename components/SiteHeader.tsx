import Image from 'next/image';

export function SiteHeader() {
  return (
    <header className="bg-white border-b border-navy/10">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
        <Image
          src="/aba-logo.png"
          alt="ABA logo"
          width={48}
          height={48}
          priority
          className="h-12 w-auto"
        />
        <div className="leading-tight">
          <h1 className="text-base lg:text-lg font-bold text-navy">
            ABA National Championship
          </h1>
          <p className="text-[11px] lg:text-xs text-muted">
            May 12–15, 2026 · Lakepoint Complex, Emerson, GA
          </p>
        </div>
      </div>
    </header>
  );
}
