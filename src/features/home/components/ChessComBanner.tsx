import Image from 'next/image';
import Link from 'next/link';

export default function ChessComBanner() {
    return (
        <div className="relative flex-shrink-0 overflow-hidden rounded-[20px] border border-[#1f2730] shadow-[0_16px_50px_rgba(0,0,0,0.25)]" style={{ height: '90px' }}>
            <Image src="/chess-banner.png" alt="2022 Chess.com Global Championship" fill className="object-cover object-left" priority />

            <div className="absolute top-0 right-0 h-full w-[320px] bg-[#05689b]" />

            <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-20">
                <div className="relative flex items-center gap-3">
                    <Link
                        href="https://chess.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 inline-flex items-center justify-center rounded-[16px] bg-[#0d3250]/95 px-8 py-3 text-[16px] font-semibold text-white shadow-[0_8px_32px_rgba(5,100,160,0.36)] border border-white/10 transition-colors hover:bg-[#0f3f66] hover:shadow-[0_12px_40px_rgba(5,100,160,0.5)]"
                    >
                        Ko&apos;rish
                    </Link>

                    {/* secondary pill removed - single Ko'rish button only */}
                </div>
            </div>
        </div>
    );
}
