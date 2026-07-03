'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface NewsItem {
    id: number;
    title: string;
    description?: string;
    date: string;
    image: string;
}

const BASE = 'http://localhost:3002';

const UZ_MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];

function fmtDate(raw: string): string {
    if (!raw) return '';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return `${UZ_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function normalizeImg(src?: string) {
    if (!src) return '/Frame.png';
    const s = src.replace(/\\/g, '/');
    return s.startsWith('http') ? s : `${BASE}/${s}`;
}

interface Props {
    news: NewsItem[];
    loading: boolean;
    visible: number;
    onLoadMore: () => void;
}

const FALLBACK_NEWS: NewsItem[] = [
    { id: 1, title: "Nodirbek Abdusattorov FIDE reytingida 2700 balldan o'tdi", description: "O'zbekistonlik yosh grosmeysteri Turkiyada o'tkazilgan shaxmat chempionatida ajoyib natijalar ko'rsatdi.", date: "Sentabr 7, 2022", image: "" },
    { id: 2, title: "Sindarov Javokhir xalqaro musobaqada g'oliblik qozondi", description: "Yosh o'zbek shaxmatchi xalqaro musobaqada o'zining mahoratini yana bir bor isbotladi.", date: "Noyabr 7, 2022", image: "" },
    { id: 3, title: "O'zbekiston shaxmatchilari olimpiadada Armanistonni mag'lubiyatga uchratdi", description: "Milliy jamoamiz olimpiadadagi o'yinda kuchli raqibni yengishga muvaffaq bo'ldi.", date: "Dekabr 7, 2022", image: "" },
    { id: 4, title: "Magnus Carlsen Norvegiya chempionatida rekord o'rnatdi", description: "Jahon chempioni o'z mamlakatida yangi rekord natijasini qayd etdi.", date: "Yanvar 3, 2023", image: "" },
];

export default function NewsList({ news, loading, visible, onLoadMore }: Props) {
    const items = news.length > 0 ? news : FALLBACK_NEWS;
    const shown = items.slice(0, visible);

    return (
        <div className="flex-shrink-0 overflow-hidden rounded-[20px] border border-[#1f2730] bg-[#0d1115]/95 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1f2730] bg-[#0b1015] px-5 py-4">
                <span className="text-base font-semibold text-white">Yangiliklar</span>
                <Link href="/news" className="flex items-center gap-0.5 text-sm text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    Barchasi <ChevronRight size={14} />
                </Link>
            </div>

            <div className="flex flex-col divide-y divide-[#1b2330]">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-3 p-4">
                            <div className="h-[64px] w-[90px] flex-shrink-0 animate-pulse rounded-xl bg-[#1b2330]" />
                            <div className="flex flex-1 flex-col justify-center gap-2">
                                <div className="h-3 w-1/4 animate-pulse rounded bg-[#1b2330]" />
                                <div className="h-3 animate-pulse rounded bg-[#1b2330]" />
                                <div className="h-3 w-3/4 animate-pulse rounded bg-[#1b2330]" />
                            </div>
                        </div>
                    ))
                ) : (
                    shown.map((item) => (
                        <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 px-5 py-5 transition-colors hover:bg-[#141b22]">
                            <div className="relative h-[90px] w-[130px] flex-shrink-0 overflow-hidden rounded-xl bg-[#1b2330]">
                                <Image src={normalizeImg(item.image)} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="mb-1 text-[11px] text-[#8b939c]">{fmtDate(item.date)}</p>
                                <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">{item.title}</p>
                                {item.description && (
                                    <p className="mt-1 line-clamp-2 text-[11px] text-[#8b939c]">{item.description}</p>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {!loading && items.length > visible && (
                <div className="flex justify-center border-t border-[#1f2730] p-4">
                    <button onClick={onLoadMore} className="cursor-pointer rounded-xl bg-[#1b2330] px-6 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2ea6ff]">
                        Ko&apos;proq
                    </button>
                </div>
            )}
        </div>
    );
}