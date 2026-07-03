"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface RatingEntry {
    rank: number;
    name: string;
    rating: number;
    trend: "up" | "down" | "none";
    positionDelta?: number;
    ratingDelta: number;
}

const STATIC_ENTRIES: RatingEntry[] = [
    {rank: 1, name: "Magnus Carlsen", rating: 2861, trend: "up", positionDelta: 12, ratingDelta: 102},
    {rank: 2, name: "Nikaru Hakamura", rating: 2850, trend: "down", positionDelta: 12, ratingDelta: -11},
    {rank: 3, name: "Abdusattorov Nodirbek", rating: 2842, trend: "up", positionDelta: 27, ratingDelta: 18},
    {rank: 4, name: "Sindarov Javokhir", rating: 2839, trend: "none", ratingDelta: 41},
    {rank: 5, name: "Yakubboev Nodirbek", rating: 2839, trend: "up", positionDelta: 5, ratingDelta: 19},
];

function toEntry(p: Record<string, unknown>, i: number): RatingEntry {
    const delta = Number(p.ratingChange ?? p.rating_change ?? p.ratingDelta ?? 0);
    const posDelta = Number(p.positionChange ?? p.position_change ?? p.positionDelta ?? 0);
    return {
        rank: i + 1,
        name: String(p.fullName ?? p.name ?? p.full_name ?? ''),
        rating: Number(p.rating ?? 0),
        trend: posDelta > 0 ? "up" : posDelta < 0 ? "down" : "none",
        positionDelta: Math.abs(posDelta) || undefined,
        ratingDelta: delta,
    };
}

function RatingRow({entry}: { entry: RatingEntry }) {
    const ratingUp = entry.ratingDelta >= 0;
    return (
        <div className="h-[62px] relative">
            <div className="absolute left-4 top-3">
                {entry.rank === 1 ? (
                    <Image src="/rank-crown.svg" alt="" width={16} height={16}/>
                ) : (
                    <span className="text-[16px] text-[#F7F9FA] leading-5">{entry.rank}.</span>
                )}
            </div>
            <span className="absolute left-10 top-3 text-[16px] text-[#F7F9FA] leading-5 whitespace-nowrap">
                {entry.name}
            </span>
            <span className="absolute right-4 top-3 text-[16px] text-[#F7F9FA] leading-5">
                {entry.rating}
            </span>
            <div className="absolute left-10 bottom-3 flex items-center gap-[2px]">
                {entry.trend === "up" && (
                    <>
                        <Image src="/rank-arrow-up.svg" alt="" width={16} height={16}/>
                        <span className="text-[12px] text-[#82CC27] leading-4">{entry.positionDelta}</span>
                    </>
                )}
                {entry.trend === "down" && (
                    <>
                        <Image src="/rank-arrow-down.svg" alt="" width={16} height={16}/>
                        <span className="text-[12px] text-[#DE4D21] leading-4">{entry.positionDelta}</span>
                    </>
                )}
                {entry.trend === "none" && (
                    <span className="text-[12px] text-[#F7F9FA]/40 leading-4">-</span>
                )}
            </div>
            <span className={`absolute right-4 bottom-3 text-[12px] leading-4 ${ratingUp ? "text-[#82CC27]" : "text-[#DE4D21]"}`}>
                {ratingUp ? "+" : ""}{entry.ratingDelta}
            </span>
        </div>
    );
}

export default function Rating() {
    const [entries, setEntries] = useState<RatingEntry[]>(STATIC_ENTRIES);

    useEffect(() => {
        axios.get('http://localhost:3002/public/player')
            .then(res => {
                const data: Record<string, unknown>[] = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data) ? res.data : [];
                if (data.length > 0) setEntries(data.slice(0, 5).map(toEntry));
            })
            .catch(() => {});
    }, []);

    return (
        <div className="w-full overflow-hidden rounded-[24px] border border-[#1d2530] bg-[#0b1117] shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1d2530] bg-[#0c141b] px-4 py-3.5">
                <h3 className="text-[15px] font-semibold text-white">Reyting</h3>
                <Link href="/reyting" className="flex items-center gap-1 text-[13px] text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    Barchasi
                    <Image src="/chevron-right.svg" alt="" width={16} height={16} />
                </Link>
            </div>
            <div className="flex items-center justify-between border-b border-[#1d2530] bg-[#0c141b] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a8188]">
                <span>O&apos;yinchi</span>
                <span>Reyting bali</span>
            </div>
            {entries.map((entry, i) => (
                <div key={entry.rank}>
                    <RatingRow entry={entry} />
                    {i < entries.length - 1 && <div className="mx-3 h-px bg-[#1b2330]" />}
                </div>
            ))}
        </div>
    );
}