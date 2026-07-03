import Link from 'next/link';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';

export interface Player {
    id: number;
    fullName: string;
    rating: number;
    country?: string;
    positionChange?: number;
    ratingChange?: number;
}

interface Props {
    players: Player[];
    loading: boolean;
}

export default function PlayerRating({ players, loading }: Props) {
    return (
        <div className="flex-shrink-0 overflow-hidden rounded-[20px] border border-[#1f2730] bg-[#0d1115]/95 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1f2730] bg-[#0b1015] px-4 py-3.5">
                <div>
                    <p className="text-[15px] font-semibold text-white">Reyting</p>
                    <p className="text-[12px] text-[#8b939c]">Eng yaxshi natijalar</p>
                </div>
                <Link href="#" className="flex items-center gap-1 text-[13px] text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    Barchasi <ChevronRight size={14} />
                </Link>
            </div>

            <div className="flex flex-col gap-1 px-2 py-2">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-2xl border border-transparent px-2 py-3">
                            <div className="h-4 flex-1 animate-pulse rounded bg-[#1b2330]" />
                            <div className="h-4 w-12 animate-pulse rounded bg-[#1b2330]" />
                        </div>
                    ))
                    : players.map((p, idx) => {
                        const pc = p.positionChange;
                        const rc = p.ratingChange;
                        const pcUp = pc !== undefined && pc > 0;
                        const pcDown = pc !== undefined && pc < 0;
                        const rcUp = rc !== undefined && rc > 0;
                        const rcDown = rc !== undefined && rc < 0;

                        return (
                            <div
                                key={p.id}
                                className="flex items-start gap-2 rounded-2xl border border-transparent px-2 py-3 transition-colors hover:border-[#1f2730] hover:bg-[#141b22]"
                            >
                                <div className="flex w-7 flex-shrink-0 items-start justify-center pt-0.5">
                                    {idx === 0 ? (
                                        <span className="select-none text-[16px] leading-none">👑</span>
                                    ) : (
                                        <span className="text-[13px] font-semibold text-[#6b7280]">{idx + 1}.</span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[14px] font-semibold leading-tight text-white">{p.fullName}</p>
                                    {pc !== undefined ? (
                                        <div className={`mt-1 flex items-center gap-1 text-[12px] font-semibold ${pcUp ? 'text-[#7ddc5f]' : pcDown ? 'text-[#ef4444]' : 'text-[#8b939c]'}`}>
                                            {pcUp ? <TrendingUp size={12} /> : pcDown ? <TrendingDown size={12} /> : null}
                                            <span>{pcUp ? `↑ ${Math.abs(pc)}` : pcDown ? `↓ ${Math.abs(pc)}` : '-'}</span>
                                        </div>
                                    ) : (
                                        <p className="mt-1 text-[12px] text-[#8b939c]">-</p>
                                    )}
                                </div>

                                <div className="flex-shrink-0 text-right">
                                    <p className="text-[15px] font-semibold text-white">{p.rating}</p>
                                    {rc !== undefined && (
                                        <p className={`mt-0.5 text-[12px] font-semibold ${rcUp ? 'text-[#7ddc5f]' : rcDown ? 'text-[#ef4444]' : 'text-[#8b939c]'}`}>
                                            {rcUp ? `+${rc}` : rcDown ? `${rc}` : '-'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
