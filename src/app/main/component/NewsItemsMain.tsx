"use client"
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

interface NewsType {
    id: number;
    title: string;
    date: string;
    image: string;
    content: string;
}

const UZ_MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

function formatDate(date: string) {
    const d = new Date(date);
    return `${UZ_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function NewsItemsMain() {
    const [news, setNews] = useState<NewsType[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function getNews() {
            const response = await axios.get(`http://localhost:3002/public/news`);
            setNews(response.data.data.slice(0, 4));
        }

        getNews();
    }, []);

    return (
        <div className="w-full overflow-hidden rounded-[20px] border border-[#1f2730] bg-[#0d1115]/95 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-[#1f2730] bg-[#0b1015] px-5 py-4">
                <h1 className="text-[15px] font-semibold text-white">Yangiliklar</h1>
                <Link href="/news" className="flex items-center gap-1 text-[13px] text-[#8b939c] transition-colors hover:text-[#2ea6ff]">
                    <span>Barchasi</span>
                    <Image src="/chevron-right.svg" alt="barchasi" width={16} height={16} />
                </Link>
            </div>

            <div className="flex flex-col divide-y divide-[#1b2330]">
                {news.map((item, index) => (
                    <div key={item.id}>
                        <div onClick={() => router.push(`/news/${item.id}`)} className="group flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-[#141b22]">
                            <Image src={item.image} alt={item.title} width={140} height={96} className="h-[96px] w-[140px] shrink-0 rounded-[12px] object-cover" />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[12px] text-[#8b939c]">{formatDate(item.date)}</p>
                                    <Image src="/arrow-right.svg" alt="" width={20} height={20} className="opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                                <h4 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-[20px] text-white transition-colors group-hover:text-[#2ea6ff]">
                                    {item.title}
                                </h4>
                                <p className="mt-1 line-clamp-2 text-[12px] leading-[18px] text-[#8b939c]">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                        {index < news.length - 1 && <div className="mx-5 h-px bg-[#1b2330]" />}
                    </div>
                ))}
            </div>

            <div className="flex justify-center border-t border-[#1f2730] px-5 py-4">
                <Link href="/news" className="flex h-10 w-[120px] items-center justify-center rounded-[12px] bg-[#1b2330] text-[14px] font-medium text-white transition-colors hover:bg-[#2ea6ff]">
                    Ko&apos;proq
                </Link>
            </div>
        </div>
    );
}
