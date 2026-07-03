"use client"
import Image from "next/image";
import Link from "next/link";
import {Eye} from "lucide-react";
import {useEffect, useState} from "react";
import axios from "axios";

interface Course {
    id: number;
    title: string;
    image: string;
    rating: number;
    viewCount?: number;
    lessonsCount?: number;
}

function normalizeImg(src?: string) {
    if (!src) return '/Frame.png';
    const s = src.replace(/\\/g, '/');
    return s.startsWith('http') ? s : `http://localhost:3002/${s}`;
}

export default function TopCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3002/public/courses')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                setCourses(data.slice(0, 4));
            })
            .finally(() => setLoading(false));
    }, []);

    const list = loading
        ? Array.from({length: 4})
        : courses;

    return (
        <div className="w-[326px] bg-[#1A1D1F] rounded-[12px] overflow-hidden px-4 pt-4 pb-4">
            <div className="flex items-center justify-between mb-5">
                <span className="text-[20px] font-medium text-[#F7F9FA] leading-[26px]">Top darsliklar</span>
                <Link
                    href="/courses"
                    className="flex items-center gap-1 text-[16px] text-[#9DA1A3] leading-[24px] hover:text-white transition-colors"
                >
                    Barchasi
                    <Image src="/chevron-right.svg" alt="" width={20} height={20}/>
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                {list.map((c, i) => (
                    <div key={loading ? i : (c as Course).id}>
                        {loading ? (
                            <div className="flex gap-[10px] items-center h-[80px]">
                                <div className="w-[80px] h-[80px] rounded-[12px] bg-[#272B30] animate-pulse shrink-0"/>
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="h-3.5 bg-[#272B30] rounded animate-pulse"/>
                                    <div className="h-3.5 bg-[#272B30] rounded animate-pulse w-2/3"/>
                                    <div className="h-3 bg-[#272B30] rounded animate-pulse w-1/3"/>
                                </div>
                            </div>
                        ) : (
                            <Link href={`/courses/${(c as Course).id}`} className="flex gap-[10px] items-center h-[80px] group">
                                <div className="relative w-[80px] h-[80px] rounded-[12px] overflow-hidden shrink-0 bg-[#272B30]">
                                    <Image
                                        src={normalizeImg((c as Course).image)}
                                        alt={(c as Course).title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 min-w-0">
                                    <p className="text-[14px] font-bold text-white leading-[18px] line-clamp-2">
                                        {(c as Course).title}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[#E0B531] text-[16px] leading-none">★</span>
                                        <span className="text-[14px] font-medium text-[#F7F9FA]">
                                            {Number((c as Course).rating ?? 3.5).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye size={16} className="text-[#F0F0F0] opacity-70 shrink-0"/>
                                        <span className="text-[13px] text-[#F0F0F0] opacity-70">
                                            {((c as Course).viewCount ?? (c as Course).lessonsCount ?? 5756).toLocaleString()}
                                        </span>
                                    </div>
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