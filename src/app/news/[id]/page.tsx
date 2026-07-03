import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

const BASE = 'http://localhost:3002';

interface News {
    id: number;
    title: string;
    image: string;
    description?: string;
    content?: string;
    createdAt: string;
    date?: string;
    views?: number;
    count?: number;
    author?: string;
}

interface Props {
    params: Promise<{ id: string }>;
}

const UZ_MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

function fmtDate(raw: string) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return `${UZ_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function fmtTime(raw: string) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function imgUrl(src?: string) {
    if (!src) return null;
    const s = src.replace(/\\/g, '/');
    return s.startsWith('http') ? s : `${BASE}/${s}`;
}

async function getNewsData(id: number) {
    try {
        const [detailRes, allRes] = await Promise.all([
            axios.get(`${BASE}/public/news/${id}`),
            axios.get(`${BASE}/public/news`),
        ]);
        const news: News = detailRes.data?.data ?? detailRes.data;
        const all: News[] = Array.isArray(allRes.data?.data)
            ? allRes.data.data
            : Array.isArray(allRes.data)
                ? allRes.data
                : [];
        const related = all.filter(n => n.id !== id).slice(0, 4);
        return { news, related };
    } catch {
        return null;
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { id } = await params;
    const newsId = Number(id);
    if (isNaN(newsId)) return <div className="py-20 text-center text-red-500">Noto&apos;g&apos;ri ID</div>;

    const data = await getNewsData(newsId);
    if (!data?.news) return <div className="py-20 text-center text-red-400">Yangilik topilmadi</div>;

    const { news, related } = data;
    const dateStr = news.createdAt ? fmtDate(news.createdAt) : (news.date ?? '');
    const timeStr = news.createdAt ? fmtTime(news.createdAt) : '';
    const views = (news.views ?? news.count ?? 0).toLocaleString();
    const image = imgUrl(news.image);
    const pageUrl = `https://uzchess.uz/news/${newsId}`;

    return (
        <div className="bg-black text-white min-h-screen">

            {/* Two-column section */}
            <div className="max-w-[1400px] mx-auto px-6 py-6 flex gap-6 items-start">

                {/* Main article */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-[26px] font-bold text-white leading-snug mb-3">
                        {news.title}
                    </h1>

                    <div className="flex items-center gap-2 text-[#8A8F98] text-sm mb-5">
                        <span>{dateStr}</span>
                        {timeStr && (
                            <>
                                <span>•</span>
                                <span>{timeStr}</span>
                            </>
                        )}
                    </div>

                    {image ? (
                        <div className="rounded-xl overflow-hidden mb-6">
                            <Image
                                src={image}
                                alt={news.title}
                                width={780}
                                height={440}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="w-full h-[360px] bg-[#161922] rounded-xl mb-6" />
                    )}

                    <div className="text-[#B1B5C4] text-[15px] leading-relaxed mb-8 space-y-4">
                        {news.content ? (
                            <div dangerouslySetInnerHTML={{ __html: news.content }} />
                        ) : news.description ? (
                            <p>{news.description}</p>
                        ) : null}
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-4 gap-4">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 bg-[#1A1D21] hover:bg-[#22262C] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors border border-[#2A2D31]">
                                <img src="/share.png" alt="share" className="w-[14px] h-[14px] object-contain" />
                                Поделиться
                            </button>
                            <div className="flex items-center gap-1.5 text-[#8A8F98] text-[13px]">
                                <Eye size={14} />
                                <span>{views}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#8A8F98] text-[12px]">
                            <span className="truncate max-w-[200px]">{pageUrl}</span>
                            <img src="/link.png" alt="copy" className="w-[14px] h-[14px] object-contain shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <aside className="w-[265px] flex-shrink-0 flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">

                    {/* Qo'llab quvvatlash */}
                    <div className="relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl px-4 py-4 flex items-center gap-4">
                        <span className="absolute top-3 right-3 text-[10px] font-bold text-[#111] bg-[#F59E0B] px-2 py-0.5 rounded-full">soon</span>
                        <div className="shrink-0">
                            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                                <path d="M8 24 Q8 30 14 32 L26 32 Q32 32 32 26 L32 18 Q32 16 30 16 Q29 16 28 17 L28 14 Q28 12 26 12 Q25 12 24 13 L24 12 Q24 10 22 10 Q20 10 20 12 L20 22 L18 20 Q16 18 14 19 Q12 20 13 22 Z" fill="#2196F3" />
                                <rect x="16" y="3" width="3" height="6" rx="1" fill="#2196F3" />
                                <rect x="14" y="5" width="7" height="2" rx="1" fill="#2196F3" />
                                <rect x="15" y="7" width="5" height="4" rx="1" fill="#2196F3" />
                                <rect x="23" y="4" width="6" height="2" rx=".5" fill="#2196F3" />
                                <rect x="24" y="6" width="4" height="5" rx="1" fill="#2196F3" />
                                <rect x="23" y="11" width="6" height="1.5" rx=".5" fill="#2196F3" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-[14px] font-semibold leading-tight">Qo&apos;llab quvvatlash</p>
                            <p className="text-[#6B7280] text-[11px] mt-0.5">Shaxmat rivojiga hissa qo&apos;shing</p>
                        </div>
                    </div>

                    {/* Suvenirlar */}
                    <div className="relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl px-4 py-4 flex items-center gap-4">
                        <span className="absolute top-3 right-3 text-[10px] font-bold text-[#111] bg-[#F59E0B] px-2 py-0.5 rounded-full">soon</span>
                        <div className="shrink-0">
                            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                                <rect x="6" y="8" width="28" height="7" rx="2" fill="#2196F3" />
                                <rect x="9" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
                                <rect x="14" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
                                <rect x="19" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
                                <rect x="24" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
                                <rect x="29" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
                                <rect x="7" y="16" width="26" height="18" rx="1" fill="#2196F3" />
                                <rect x="16" y="24" width="8" height="10" rx="1" fill="#1565C0" />
                                <rect x="9" y="19" width="6" height="5" rx="1" fill="#1565C0" />
                                <rect x="25" y="19" width="6" height="5" rx="1" fill="#1565C0" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-[14px] font-semibold leading-tight">Suvenirlar</p>
                            <p className="text-[#6B7280] text-[11px] mt-0.5">Tematik maxsulotlar magazini</p>
                        </div>
                    </div>

                    {/* Yoshlar portali */}
                    <div className="w-full rounded-2xl overflow-hidden">
                        <Image
                            src="/Banners.png"
                            alt="Yoshlar portali"
                            width={265}
                            height={160}
                            className="w-full h-auto block"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                </aside>
            </div>

            {/* Boshqa yangiliklar — ikkala ustundan tashqarida, to'liq kenglikda */}
            {related.length > 0 && (
                <div className="max-w-[1400px] mx-auto px-6 pb-10">
                    <h2 className="text-[20px] font-bold text-white mb-5">Boshqa yangiliklar</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {related.map(item => (
                            <Link
                                key={item.id}
                                href={`/news/${item.id}`}
                                className="group flex items-start gap-4 hover:opacity-90 transition-opacity"
                            >
                                <div className="relative w-[150px] h-[100px] rounded-xl overflow-hidden bg-[#1A1D21] shrink-0">
                                    {imgUrl(item.image) ? (
                                        <Image
                                            src={imgUrl(item.image)!}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#222]" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#8A8F98] text-[11px] mb-1">
                                        {item.date ?? (item.createdAt ? fmtDate(item.createdAt) : '')}
                                    </p>
                                    <p className="text-white text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-[#2196F3] transition-colors">
                                        {item.title}
                                    </p>
                                    {item.description && (
                                        <p className="text-[#8A8F98] text-[12px] mt-1 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}