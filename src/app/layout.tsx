import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Esontoy Platform',
  description: 'MVP control center for KunPan and RP monitoring.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="dark">
      <body className={`${inter.className} bg-night-900 text-slate-100`}>
        <div className="min-h-screen w-full">
          <header className="border-b border-night-700/60 bg-night-800/60 backdrop-blur sticky top-0 z-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <p className="text-lg font-semibold tracking-widest text-night-neon">ESONTOY OPS</p>
              <nav className="flex gap-4 text-sm uppercase text-slate-300">
                <a className="hover:text-night-neon" href="/">Dashboard</a>
                <a className="hover:text-night-neon" href="/kunpan">KunPan</a>
                <a className="hover:text-night-neon" href="/kunpan/new">New KunPan</a>
                <a className="hover:text-night-neon" href="/admin">Admin</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
