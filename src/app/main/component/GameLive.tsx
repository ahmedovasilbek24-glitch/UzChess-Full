"use client"
import Image from "next/image";

interface GameOfDayProps {
    image?: string;
    time: string;
    gameType: string;
    whitePlayer: string;
    blackPlayer: string;
    onWatch?: () => void;
}

export default function GameLive({image, time, gameType, whitePlayer, blackPlayer, onWatch}: GameOfDayProps) {
    return (
        <div className="w-full overflow-hidden rounded-[24px] border border-[#1d2530] bg-[#0b1117] shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1d2530] bg-[#0c141b] px-4 py-3.5">
                <h3 className="text-[15px] font-semibold text-white">Kun o&apos;yini</h3>
                <button onClick={onWatch} className="flex items-center gap-1 text-[13px] text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    Ko&apos;rish
                    <Image src="/chevron-right.svg" alt="" width={16} height={16} />
                </button>
            </div>

            <div className="relative h-[182px] w-full cursor-pointer overflow-hidden" onClick={onWatch}>
                {image && <Image src={image} alt="Kun o'yini" fill className="object-cover" />}
                <div className="absolute inset-0 bg-[#071019]/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/20 backdrop-blur-sm">
                        <Image src="/play.svg" alt="" width={28} height={28} />
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-[#0b1015]/70 px-3 py-2 backdrop-blur-sm">
                    <span className="text-[13px] font-medium text-white">{time}</span>
                    <div className="flex items-center gap-1 rounded-full bg-[#14222b] px-2.5 py-1">
                        <Image src="/Frame.svg" alt="" width={16} height={16} />
                        <span className="text-[12px] font-semibold text-[#7ddc5f]">{gameType}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 bg-[#0c141b] px-3 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="relative h-8 w-7 shrink-0">
                        <Image src="/like-badge.svg" alt="like" width={56} height={72} className="absolute -left-2 -top-4 h-[72px] w-[56px] max-w-none" />
                    </div>
                    <span className="break-words text-[12px] font-semibold leading-tight text-white">{whitePlayer}</span>
                </div>
                <Image src="/vs.svg" alt="vs" width={28} height={28} className="shrink-0" />
                <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-2">
                    <div className="relative h-8 w-7 shrink-0">
                        <Image src="/dislike-badge.svg" alt="dislike" width={24} height={40} className="absolute -right-1 -top-3 h-[40px] w-[24px] max-w-none" />
                    </div>
                    <span className="break-words text-right text-[12px] font-semibold leading-tight text-white">{blackPlayer}</span>
                </div>
            </div>
        </div>
    );
}
