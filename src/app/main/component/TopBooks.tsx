"use client"
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";

interface Book {
    id: number;
    title: string;
    image: string;
    author?: { fullName: string } | string;
}

function normalizeImg(src?: string) {
    if (!src) return '/Frame.png';
    const s = src.replace(/\\/g, '/');
    return s.startsWith('http') ? s : `http://localhost:3002/${s}`;
}

function getAuthorName(author?: { fullName: string } | string): string {
    if (!author) return '';
    if (typeof author === 'string') return author;
    return author.fullName ?? '';
}

export default function TopBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3002/public/book')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                setBooks(data.slice(0, 4));
            })
            .finally(() => setLoading(false));
    }, []);

    const list = loading
        ? Array.from({length: 4})
        : books;

    return (
        <div className="w-[326px] bg-[#1A1D1F] rounded-[12px] overflow-hidden px-4 pt-4 pb-4">
            <div className="flex items-center justify-between mb-5">
                <span className="text-[20px] font-medium text-[#F7F9FA] leading-[26px]">Top kitoblar</span>
                <Link
                    href="/library"
                    className="flex items-center gap-1 text-[16px] text-[#9DA1A3] leading-[24px] hover:text-white transition-colors"
                >
                    Barchasi
                    <Image src="/chevron-right.svg" alt="" width={20} height={20}/>
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                {list.map((b, i) => (
                    <div key={loading ? i : (b as Book).id}>
                        {loading ? (
                            <div className="flex gap-[10px] items-center h-[80px]">
                                <div className="w-[54px] h-[80px] rounded-[8px] bg-[#272B30] animate-pulse shrink-0"/>
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="h-3.5 bg-[#272B30] rounded animate-pulse"/>
                                    <div className="h-3.5 bg-[#272B30] rounded animate-pulse w-3/4"/>
                                    <div className="h-3 bg-[#272B30] rounded animate-pulse w-1/2"/>
                                </div>
                            </div>
                        ) : (
                            <Link href={`/library/${(b as Book).id}`} className="flex gap-[10px] items-center h-[80px] group">
                                <div className="relative w-[54px] h-[80px] rounded-[8px] overflow-hidden shrink-0 bg-[#272B30]">
                                    <Image
                                        src={normalizeImg((b as Book).image)}
                                        alt={(b as Book).title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 min-w-0">
                                    <p className="text-[14px] font-bold text-white leading-[18px] line-clamp-2">
                                        {(b as Book).title}
                                    </p>
                                    {getAuthorName((b as Book).author) && (
                                        <p className="text-[13px] text-[#F0F0F0] opacity-70 truncate">
                                            {getAuthorName((b as Book).author)}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        )}
                        {i < list.length - 1 && (
                            <div className="h-px bg-[#1F272A] mt-3"/>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}