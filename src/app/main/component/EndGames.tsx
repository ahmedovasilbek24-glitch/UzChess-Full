"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

type GameType = "Bullet" | "Blitz" | "Rapid";

interface GameRow {
    player1: string;
    rating1: number;
    score1: number;
    trophy1: "gold" | "gray";
    player2: string;
    rating2: number;
    score2: number;
    trophy2: "gold" | "gray";
    gameType: GameType;
    date: string;
    moves: number;
}

const gameTypeStyle: Record<GameType, { icon: string; color: string }> = {
    Bullet: {icon: "/Frame.svg", color: "#82CC27"},
    Blitz: {icon: "/blitz-icon.svg", color: "#E0B531"},
    Rapid: {icon: "/rapid-icon.svg", color: "#DC2D2D"},
};

const STATIC_ROWS: GameRow[] = [
    {
        player1: "Shohrukh Bakhtiyarov", rating1: 2861, score1: 2, trophy1: "gold",
        player2: "nikaru hakamura", rating2: 2768, score2: 0, trophy2: "gray",
        gameType: "Rapid", date: "12 Dekabr", moves: 56,
    },
    {
        player1: "Abdusattorov Nodirbek", rating1: 2604, score1: 1, trophy1: "gold",
        player2: "Ding Liren", rating2: 2312, score2: 0, trophy2: "gray",
        gameType: "Bullet", date: "21 Noyabr", moves: 20,
    },
    {
        player1: "Aronian Levon", rating1: 2402, score1: 0, trophy1: "gold",
        player2: "Sindarov Javokhir", rating2: 2641, score2: 2, trophy2: "gold",
        gameType: "Blitz", date: "19 Oktabr", moves: 19,
    },
    {
        player1: "Caruana Fabiano", rating1: 2402, score1: 1, trophy1: "gold",
        player2: "Rapport Richard", rating2: 2641, score2: 1, trophy2: "gray",
        gameType: "Blitz", date: "2 Sentabr", moves: 56,
    },
    {
        player1: "Yakubboev Nodirbek", rating1: 2402, score1: 4, trophy1: "gold",
        player2: "Gelfand Boris", rating2: 2641, score2: 1, trophy2: "gray",
        gameType: "Bullet", date: "2 Sentabr", moves: 56,
    },
];

const UZ_MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

function fmtDate(raw: string) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]}`;
}

function toRow(g: Record<string, unknown>): GameRow {
    const result = String(g.result ?? g.score ?? '1-0');
    const [s1, s2] = result.split('-').map(Number);
    const type = String(g.type ?? g.gameType ?? g.game_type ?? 'Rapid');
    const gameType: GameType = (['Bullet', 'Blitz', 'Rapid'].includes(type) ? type : 'Rapid') as GameType;
    const rawDate = String(g.date ?? g.createdAt ?? g.created_at ?? '');
    return {
        player1: String(g.p1 ?? g.player1 ?? g.white ?? ''),
        rating1: Number(g.p1Rating ?? g.rating1 ?? g.whiteRating ?? 0),
        score1: isNaN(s1) ? 1 : s1,
        trophy1: (!isNaN(s1) && !isNaN(s2) && s1 > s2) ? 'gold' : 'gray',
        player2: String(g.p2 ?? g.player2 ?? g.black ?? ''),
        rating2: Number(g.p2Rating ?? g.rating2 ?? g.blackRating ?? 0),
        score2: isNaN(s2) ? 0 : s2,
        trophy2: (!isNaN(s1) && !isNaN(s2) && s2 > s1) ? 'gold' : 'gray',
        gameType,
        date: rawDate ? fmtDate(rawDate) : String(g.date ?? ''),
        moves: Number(g.moves ?? g.movesCount ?? 0),
    };
}

function GameRowItem({row, striped}: { row: GameRow; striped: boolean }) {
    const type = gameTypeStyle[row.gameType];
    return (
        <div className={`relative h-[72px] ${striped ? "bg-[#15181A]" : ""}`}>
            <Image src={row.trophy1 === "gold" ? "/trophy-gold.svg" : "/trophy-gray.svg"} alt=""
                   width={16} height={16} className="absolute top-[17px] left-[20px]"/>
            <span className="absolute top-[15px] left-[40px] text-[14px] text-[#FCFCFC] leading-[21px]">{row.player1}</span>
            <Image src={row.trophy2 === "gold" ? "/trophy-gold.svg" : "/trophy-gray.svg"} alt=""
                   width={16} height={16} className="absolute top-[39px] left-[20px]"/>
            <span className="absolute top-[37px] left-[40px] text-[14px] text-[#FCFCFC] leading-[21px]">{row.player2}</span>

            <span className="absolute top-[16px] left-[229px] text-[14px] text-[#6F767E] leading-[18px]">({row.rating1})</span>
            <span className="absolute top-[38px] left-[229px] text-[14px] text-[#6F767E] leading-[18px]">({row.rating2})</span>

            <span className="absolute top-[16px] left-[328px] text-[14px] text-[#FCFCFC] leading-[18px]">{row.score1}</span>
            <span className="absolute top-[38px] left-[328px] text-[14px] text-[#FCFCFC] leading-[18px]">{row.score2}</span>

            <div className="absolute top-[26px] left-[394px] flex items-center gap-1">
                <Image src={type.icon} alt="" width={20} height={20}/>
                <span className="text-[14px] font-medium leading-[18px]" style={{color: type.color}}>{row.gameType}</span>
            </div>

            <span className="absolute top-[27px] left-[514px] text-[14px] text-[#FCFCFC] leading-[18px]">{row.moves}</span>
            <span className="absolute top-[27px] right-[20px] text-[14px] text-[#FCFCFC] leading-[18px] text-right">{row.date}</span>
        </div>
    );
}


export default function EndGames() {
    const [rows, setRows] = useState<GameRow[]>(STATIC_ROWS);

    useEffect(() => {
        axios.get('http://localhost:3002/public/games')
            .then(res => {
                const data: Record<string, unknown>[] = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data) ? res.data : [];
                if (data.length > 0) setRows(data.slice(0, 5).map(toRow));
            })
            .catch(() => {});
    }, []);

    return (
        <div className="w-full overflow-hidden rounded-[24px] border border-[#1d2530] bg-[#0b1117] shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1d2530] bg-[#0c141b] px-5 py-4">
                <h3 className="text-[15px] font-semibold text-white">Tamomlangan o&apos;yinlar</h3>
                <Link href="/game" className="flex items-center gap-1 text-[13px] text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    Barchasi
                    <Image src="/chevron-right.svg" alt="" width={16} height={16} />
                </Link>
            </div>

            <div className="flex items-center justify-between border-b border-[#1d2530] bg-[#0c141b] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a8188]">
                <span>O&apos;yinchilar</span>
                <span>Natija</span>
                <span>Tur</span>
                <span>Yurishlar</span>
                <span>Sana</span>
            </div>

            <div>
                {rows.map((row, i) => (
                    <div key={i}>
                        <GameRowItem row={row} striped={i % 2 === 1} />
                        {i < rows.length - 1 && <div className="mx-5 h-px bg-[#1b2330]" />}
                    </div>
                ))}
            </div>
        </div>
    );
}