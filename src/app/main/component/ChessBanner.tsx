"use client"
import Image from "next/image";
import Link from "next/link";

export default function ChessBanner() {
    return (
        <div className="relative h-[104px] w-full overflow-hidden rounded-[24px] border border-[#1e2a37] bg-[#0c1420] shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
            <Image
                src="/chess-banner.png"
                alt="2022 Chess.com Global Championship"
                fill
                sizes="100vw"
                priority
                className="object-cover object-left"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#08111a]/40 via-[#08111a]/10 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-[320px] bg-[#05689b]" />

            <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                <Link
                    href="https://chess.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[16px] border border-white/15 bg-[#0d3354] px-7 py-3 text-[16px] font-semibold text-white shadow-[0_12px_36px_rgba(7,44,72,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f4068]"
                >
                    Ko&apos;rish
                </Link>
            </div>
        </div>
    );
}