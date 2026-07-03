'use client';

import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';

export interface Game {
    id: number;
    p1: string;
    p1Rating?: number;
    p2: string;
    p2Rating?: number;
    result: string;
    type: string;
    moves: number;
    date: string;
}

interface Props {
    games: Game[];
}

function parseScores(result: string): [string, string] {
    if (result === '1-0') return ['1', '0'];
    if (result === '0-1') return ['0', '1'];
    if (result === '½-½') return ['½', '½'];
    const parts = result.split('-');
    return [parts[0] ?? result, parts[1] ?? ''];
}

function p1Wins(result: string) {
    const [a, b] = result.split('-').map(Number);
    if (!isNaN(a) && !isNaN(b)) return a >= b;
    return result.startsWith('1') || result.startsWith('2') || result.startsWith('4');
}
function p2Wins(result: string) {
    if (result === '0-1') return true;
    const [a, b] = result.split('-').map(Number);
    return !isNaN(a) && !isNaN(b) && b >= a;
}

function GameTypeIcon({ type }: { type: string }) {
    if (type === 'Rapid') return (
        <span className="flex items-center gap-1.5">
            <span className="text-[15px] leading-none text-[#ef4444] select-none">♞</span>
            <span className="text-[12px] font-semibold text-[#ef4444]">{type}</span>
        </span>
    );
    if (type === 'Bullet') return (
        <span className="flex items-center gap-1">
            <Zap size={13} className="flex-shrink-0 fill-[#7ddc5f] text-[#7ddc5f]" />
            <span className="text-[12px] font-semibold text-[#7ddc5f]">{type}</span>
        </span>
    );
    if (type === 'Blitz') return (
        <span className="flex items-center gap-0.5">
            <Zap size={12} className="flex-shrink-0 fill-[#f4c84d] text-[#f4c84d]" />
            <Zap size={12} className="-ml-1 flex-shrink-0 fill-[#f4c84d] text-[#f4c84d]" />
            <span className="ml-1 text-[12px] font-semibold text-[#f4c84d]">{type}</span>
        </span>
    );
    return (
        <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-[#a78bfa]" />
            <span className="text-[12px] font-semibold text-[#a78bfa]">{type}</span>
        </span>
    );
}

export default function UpcomingGames({ games }: Props) {
    return (
        <div className="flex-shrink-0 overflow-hidden rounded-[20px] border border-[#1f2730] bg-[#0d1115]/95 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1f2730] bg-[#0b1015] px-5 py-4">
                <span className="text-base font-semibold text-white">Tamomlangan o&apos;yinlar</span>
                <Link href="#" className="flex items-center gap-0.5 text-sm text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    Barcha o&apos;yinlar <ChevronRight size={16} />
                </Link>
            </div>

            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="border-b border-[#1f2730] bg-[#0b1015]">
                        <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-[0.24em] text-[#8b939c]">O&apos;YINCHILAR</th>
                        <th className="px-3 py-3 text-center text-[11px] font-semibold tracking-[0.24em] text-[#8b939c]">NATIJA</th>
                        <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-[0.24em] text-[#8b939c]">VAQT</th>
                        <th className="px-3 py-3 text-center text-[11px] font-semibold tracking-[0.24em] text-[#8b939c]">YURISHLAR</th>
                        <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-[0.24em] text-[#8b939c]">SANA</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((g) => {
                        const [s1, s2] = parseScores(g.result);
                        const w1 = p1Wins(g.result);
                        const w2 = p2Wins(g.result);
                        const t1 = w1 ? '🏆' : '🥈';
                        const t2 = w2 ? '🏆' : '🥈';
                        return (
                            <tr key={g.id} className="cursor-pointer border-b border-[#151b22] transition-colors hover:bg-[#141b22]">
                                <td className="px-5 py-3">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="select-none text-[13px] leading-none">{t1}</span>
                                            <span className={`text-[13px] font-medium ${w1 ? 'text-white' : 'text-[#6b7280]'}`}>{g.p1}</span>
                                            {g.p1Rating && <span className="text-[12px] text-[#8b939c]">({g.p1Rating})</span>}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="select-none text-[13px] leading-none">{t2}</span>
                                            <span className={`text-[13px] font-medium ${w2 ? 'text-white' : 'text-[#6b7280]'}`}>{g.p2}</span>
                                            {g.p2Rating && <span className="text-[12px] text-[#8b939c]">({g.p2Rating})</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <span className={`text-[15px] font-semibold ${w1 ? 'text-white' : 'text-[#8b939c]'}`}>{s1}</span>
                                        <span className={`text-[15px] font-semibold ${w2 ? 'text-white' : 'text-[#8b939c]'}`}>{s2}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <GameTypeIcon type={g.type} />
                                </td>
                                <td className="px-3 py-3 text-center text-[13px] text-[#8b939c]">{g.moves}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-[13px] text-[#8b939c]">{g.date}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
