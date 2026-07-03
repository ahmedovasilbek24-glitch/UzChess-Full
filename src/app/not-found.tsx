import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="bg-black text-white flex items-center" style={{ minHeight: 'calc(100vh - 108px)' }}>
            <div className="max-w-[1400px] mx-auto px-6 py-16 w-full flex flex-col lg:flex-row items-center justify-between gap-16">

                <div className="flex flex-col gap-5">
                    <h1 className="font-black leading-none text-white" style={{ fontSize: '160px', lineHeight: 1 }}>404</h1>
                    <h2 className="text-3xl font-bold text-white">Sahifa topilmadi</h2>
                    <p className="text-[#8A8F98] text-base">Uups... Siz qidirayotgan sahifani topa olmadik :(</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold text-sm transition-colors w-fit"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Asosiyga qaytish
                    </Link>
                </div>

                {/* Right: chess board illustration */}
                <div className="shrink-0">
                    <Image
                        src="/chess-board-404.png"
                        alt="Chess board"
                        width={660}
                        height={370}
                        priority
                        className="w-full h-auto"
                        style={{ maxWidth: '660px' }}
                    />
                </div>
            </div>
        </div>
    );
}
