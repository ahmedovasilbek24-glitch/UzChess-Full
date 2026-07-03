import Image from 'next/image';
import Link from 'next/link';
import {ChevronRight, Eye} from 'lucide-react';

export interface Course {
    id: number;
    title: string;
    image: string;
    rating: number;
    lessonsCount?: number;
    viewCount?: number;
    author?: { fullName: string };
}

const BASE = 'http://localhost:3002';

function normalizeImg(src?: string) {
    if (!src) return '/Frame.png';
    const s = src.replace(/\\/g, '/');
    return s.startsWith('http') ? s : `${BASE}/${s}`;
}

interface Props {
    courses: Course[];
    loading: boolean;
}

export default function TopCourse({courses, loading}: Props) {
    const list = courses.slice(0, 4);

    return (
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-[16px]">Top darsliklar</span>
                <Link href="/courses"
                      className="text-[#8A8F98] text-[13px] flex items-center gap-0.5 hover:text-white transition-colors">
                    Barchasi <ChevronRight size={14}/>
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {loading
                    ? Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-[70px] h-[70px] bg-[#1A1D21] rounded-xl animate-pulse flex-shrink-0"/>
                            <div className="flex-1 flex flex-col gap-2 justify-center">
                                <div className="h-3.5 bg-[#1A1D21] rounded animate-pulse"/>
                                <div className="h-3.5 bg-[#1A1D21] rounded animate-pulse w-2/3"/>
                                <div className="h-3 bg-[#1A1D21] rounded animate-pulse w-1/2"/>
                            </div>
                        </div>
                    ))
                    : list.length === 0
                        ? <p className="text-[#8A8F98] text-xs text-center py-2">Kurslar yo&apos;q</p>
                        : list.map((c) => (
                            <Link key={c.id} href={`/courses/${c.id}`} className="flex gap-3 group">
                                <div
                                    className="relative w-[70px] h-[70px] rounded-xl overflow-hidden flex-shrink-0 bg-[#1A1D21]">
                                    <Image
                                        src={normalizeImg(c.image)}
                                        alt={c.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                                    <p className="text-white text-[14px] font-semibold leading-snug line-clamp-2">{c.title}</p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[#FACC15] text-[14px] leading-none">★</span>
                                        <span
                                            className="text-[#8A8F98] text-[13px]">{Number(c.rating ?? 3.5).toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#8A8F98]">
                                        <Eye size={12}/>
                                        <span
                                            className="text-[13px]">{(c.viewCount ?? c.lessonsCount ?? 5756).toLocaleString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                }
            </div>
        </div>
    );
}
