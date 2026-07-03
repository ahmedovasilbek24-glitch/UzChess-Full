"use client"
import Image from "next/image";

interface QuickLinkInterface {
    label: string;
    iconGlowSrc: string;
    watermarkSrc: string;
    watermarkWidth: number;
    watermarkHeight: number;
    watermarkTop: number;
    watermarkLeft: number;
    onClick?: () => void;
}

export default function QuickCarts({
                                          label,
                                          iconGlowSrc,
                                          watermarkSrc,
                                          watermarkWidth,
                                          watermarkHeight,
                                          watermarkTop,
                                          watermarkLeft,
                                          onClick
                                      }: QuickLinkInterface) {
    return (
        <div
            onClick={onClick}
            className="group relative h-[72px] cursor-pointer overflow-hidden rounded-[24px] border border-[#1b2431] bg-[#0b1320] shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#08111d]/80 via-transparent to-[#08111d]/80" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity duration-300" />
            <Image src={watermarkSrc} alt="" width={watermarkWidth} height={watermarkHeight} className="absolute mix-blend-overlay opacity-10" style={{ top: watermarkTop, left: watermarkLeft }} />

            <div className="relative flex h-full items-center gap-4 px-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#0d3e74] shadow-[0_8px_24px_rgba(46,166,255,0.18)]">
                    <Image src={iconGlowSrc} alt="" width={22} height={22} className="object-contain" />
                </div>
                <span className="text-[18px] font-semibold text-white leading-tight">
                    {label}
                </span>
            </div>
        </div>
    );
}
