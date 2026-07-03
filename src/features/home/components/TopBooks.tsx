import Image from 'next/image';
import Link from 'next/link';
import {ChevronRight} from 'lucide-react';

export interface Book {
    id: number;
    title: string;
    image: string;
    author?: { fullName: string };
}

const BASE = 'http://localhost:3002';

function normalizeImg(src?: string) {
    if (!src) return '/Frame.png';
    const s = src.replace(/\\/g, '/');
    return s.startsWith('http') ? s : `${BASE}/${s}`;
}

interface Props {
    books: Book[];
    loading: boolean;
}

export default function TopBooks({books, loading}: Props) {
    const list = books.slice(0, 4);

    return (
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-[16px]">Top kitoblar</span>
                <Link href="/library"
                      className="text-[#8A8F98] text-[13px] flex items-center gap-0.5 hover:text-white transition-colors">
                    Barchasi <ChevronRight size={14}/>
                </Link>
            </div>

            <div className="flex flex-col divide-y divide-[#111]">
                {loading
                    ? Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="flex gap-3 py-3">
                            <div className="w-[56px] bg-[#1A1D21] rounded-lg animate-pulse flex-shrink-0"
                                 style={{height: '76px'}}/>
                            <div className="flex-1 flex flex-col gap-2 justify-center">
                                <div className="h-3.5 bg-[#1A1D21] rounded animate-pulse"/>
                                <div className="h-3.5 bg-[#1A1D21] rounded animate-pulse w-3/4"/>
                                <div className="h-3 bg-[#1A1D21] rounded animate-pulse w-1/2"/>
                            </div>
                        </div>
                    ))
                    : list.length === 0
                        ? <p className="text-[#8A8F98] text-xs text-center py-2">Kitoblar yo&apos;q</p>
                        : list.map((b) => (
                            <Link key={b.id} href={`/library/${b.id}`}
                                  className="flex gap-3 py-3 group hover:opacity-90 transition-opacity">
                                <div className="relative w-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1D21]"
                                     style={{height: '76px'}}>
                                    <Image
                                        src={normalizeImg(b.image)}
                                        alt={b.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                    <p className="text-white text-[14px] font-semibold leading-snug line-clamp-2">{b.title}</p>
                                    {b.author && (
                                        <p className="text-[#8A8F98] text-[13px] truncate">{b.author.fullName}</p>
                                    )}
                                </div>
                            </Link>
                        ))
                }
            </div>
        </div>
    );
}
