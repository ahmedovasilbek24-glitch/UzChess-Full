'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight, Play, ThumbsUp, ThumbsDown, Swords, Zap } from 'lucide-react';

interface GameData {
    p1: { name: string };
    p2: { name: string };
    type: string;
    time: string;
    image?: string;
}

const STATIC_GAME: GameData = {
    p1: { name: 'Abdusattorov Nodirbek' },
    p2: { name: 'Magnus Carlsen' },
    type: 'Bullet',
    time: '5:30',
};

function GameTypeBadge({ type }: { type: string }) {
    if (type === 'Bullet') return (
        <span className="flex items-center gap-1 rounded-full bg-[#1d2b1f] px-2.5 py-1">
            <Zap size={12} className="text-[#7ddc5f] fill-[#7ddc5f]" />
            <span className="text-[12px] font-semibold text-[#7ddc5f]">{type}</span>
        </span>
    );
    if (type === 'Blitz') return (
        <span className="flex items-center gap-0.5 rounded-full bg-[#2d2413] px-2.5 py-1">
            <Zap size={12} className="text-[#f4c84d] fill-[#f4c84d]" />
            <Zap size={12} className="text-[#f4c84d] fill-[#f4c84d] -ml-1" />
            <span className="ml-1 text-[12px] font-semibold text-[#f4c84d]">{type}</span>
        </span>
    );
    if (type === 'Rapid') return (
        <span className="flex items-center gap-1 rounded-full bg-[#2b1718] px-2.5 py-1">
            <span className="text-[12px]">&#9822;</span>
            <span className="text-[12px] font-semibold text-[#ef4444]">{type}</span>
        </span>
    );
    return <span className="text-[12px] text-[#8b939c]">{type}</span>;
}

export default function DailyGame() {
    const [game, setGame] = useState<GameData>(STATIC_GAME);

    useEffect(() => {
        axios.get('http://localhost:3002/public/game/daily')
            .then(res => {
                const d = res.data?.data ?? res.data;
                if (!d) return;
                const p1name = d.p1?.name ?? d.white?.name ?? d.whitePlayer ?? d.player1 ?? '';
                const p2name = d.p2?.name ?? d.black?.name ?? d.blackPlayer ?? d.player2 ?? '';
                const type = d.type ?? d.gameType ?? d.game_type ?? 'Bullet';
                const time = d.time ?? d.duration ?? '5:30';
                if (p1name || p2name) {
                    setGame({ p1: { name: p1name }, p2: { name: p2name }, type, time, image: d.image });
                }
            })
            .catch(() => {});
    }, []);

    const imgSrc = game.image
        ? (game.image.startsWith('http') ? game.image : `http://localhost:3002/${game.image.replace(/\\/g, '/')}`)
        : '/kun-oyini-photo.png';

    return (
        <div className="flex-shrink-0 overflow-hidden rounded-[20px] border border-[#1f2730] bg-[#0d1115]/95 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1f2730] bg-[#0b1015] px-4 py-3.5">
                <span className="text-[15px] font-semibold text-white">Kun o&apos;yini</span>
                <Link href="#" className="flex items-center gap-0.5 text-[13px] text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    Ko&apos;rish <ChevronRight size={14} />
                </Link>
            </div>

            <div className="relative mx-3 mt-3 overflow-hidden rounded-[16px]" style={{ height: '158px' }}>
                <Image src={imgSrc} alt="Kun o'yini" fill className="object-cover" priority />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/20 backdrop-blur-sm">
                        <Play size={20} className="ml-0.5 fill-white text-white" />
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2">
                    <span className="text-[13px] font-medium text-white">{game.time}</span>
                    <GameTypeBadge type={game.type} />
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#7ddc5f]">
                        <ThumbsUp size={15} className="text-white" />
                    </div>
                    <span className="text-[12px] font-semibold leading-tight text-white">{game.p1.name}</span>
                </div>

                <div className="flex-shrink-0">
                    <Swords size={18} className="text-[#2ea6ff]" />
                </div>

                <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#ef4444]">
                        <ThumbsDown size={15} className="text-white" />
                    </div>
                    <span className="text-right text-[12px] font-semibold leading-tight text-white">{game.p2.name}</span>
                </div>
            </div>
        </div>
    );
}