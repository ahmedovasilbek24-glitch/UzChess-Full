'use client';

import {useEffect, useRef, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import {Great_Vibes} from 'next/font/google';
import {ChevronRight, Download, Star} from 'lucide-react';
import YouthCard from '@/features/shared/components/YouthCard/YouthCard';
import {getStoredUser} from '@/lib/user';
import axios from 'axios';

const greatVibes = Great_Vibes({subsets: ['latin'], weight: '400'});

const BASE = 'http://localhost:3002';

function norm(src?: string) {
    if (!src) return '';
    const s = src.replace(/\\/g, '/');
    return s.startsWith('http') ? s : `${BASE}/${s}`;
}

export default function CertificatePage() {
    const {id} = useParams<{ id: string }>();
    const router = useRouter();
    const certificateRef = useRef<HTMLDivElement>(null);

    const [course, setCourse] = useState<any>(null);
    const [userName, setUserName] = useState('Foydalanuvchi');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const cRes = await fetch(`${BASE}/public/courses/${id}`, {cache: 'no-store'});
                const cData = await cRes.json();
                setCourse(cData);

                const stored = getStoredUser();
                if (stored?.fullName) setUserName(stored.fullName);
            } catch {
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    async function handleDownload() {
        if (!certificateRef.current) return;
        setDownloading(true);
        try {
            const {toPng} = await import('html-to-image');
            const dataUrl = await toPng(certificateRef.current, {pixelRatio: 2});
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'Certificate.png';
            a.click();
        } catch {
        } finally {
            setDownloading(false);
        }
    }

    async function handleSubmitReview() {
        if (!rating) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await axios.post(
                `${BASE}/public/courseReviews`,
                {courseId: Number(id), rating, comment},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setSubmitted(true);
        } catch {
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
            <div className="text-white">Yuklanmoqda...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="mx-auto max-w-7xl px-4 py-6">

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main content */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Certificate + congrats */}
                        <div
                            className="bg-[#0D1628] rounded-2xl border border-[#1d2733] px-8 py-10 flex flex-col items-center text-center gap-5">
                            {/* Certificate preview */}
                            <div className="w-full max-w-md">
                                <div ref={certificateRef} className="relative w-full aspect-[842/595] bg-[#F7F9FA] rounded-xl overflow-hidden shadow-2xl" style={{containerType: 'inline-size'}}>
                                    <img src="/certificate/pattern-left.png" alt="" className="absolute left-0 top-0 object-cover" style={{width: '8.5%', height: '100%'}} />
                                    <img src="/certificate/pattern-right.png" alt="" className="absolute right-0 top-0 object-cover" style={{width: '8.5%', height: '100%'}} />
                                    <img src="/certificate/border.png" alt="" className="absolute inset-0 w-full h-full" />

                                    <img src="/certificate/logo.svg" alt="UzChess" className="absolute" style={{left: '41.2%', top: '11.1%', width: '17.6%', height: 'auto'}} />

                                    <div className="absolute text-center" style={{left: '50%', top: '40.5%', width: '59%', transform: 'translateX(-50%)'}}>
                                        <p className={`${greatVibes.className} text-[#13181C] leading-none`} style={{fontSize: '7.5cqw'}}>
                                            {userName}
                                        </p>
                                        <div className="mx-auto mt-1 border-b-[3px] border-[#1C92E0]" style={{width: '100%'}} />
                                    </div>

                                    <div className="absolute text-center" style={{left: '18.6%', top: '50%', width: '62.7%'}}>
                                        <p className="text-[#1A1D1F]" style={{fontSize: '1.8cqw'}}>
                                            UzChess platformasidagi &ldquo;{course?.title ?? 'kurs'}&rdquo; kursini muvaffaqiyatli yakunlagani uchun maxsus sertifikat bilan taqdirlanadi!
                                        </p>
                                        <p className="text-[#9DA1A3] mt-1" style={{fontSize: '1.6cqw'}}>
                                            {(() => {
                                                const d = new Date();
                                                const pad = (n: number) => String(n).padStart(2, '0');
                                                return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
                                            })()}
                                        </p>
                                    </div>

                                    <img src="/certificate/qr.png" alt="QR" className="absolute" style={{left: '15%', top: '76.5%', width: '9.5%', height: 'auto'}} />
                                    <img src="/certificate/seal.png" alt="Muhr" className="absolute" style={{left: '44.3%', top: '73.8%', width: '11.4%', height: 'auto'}} />

                                    <div className="absolute flex flex-col items-center" style={{left: '66.5%', top: '74.8%', width: '18.5%'}}>
                                        <img src="/certificate/signature.svg" alt="Imzo" style={{width: '65%', height: 'auto'}} />
                                        <div className="w-full border-t border-[#383C57]" />
                                        <p className="text-[#383C57] mt-0.5" style={{fontSize: '1.5cqw'}}>Sa&apos;dullayev A. Z.</p>
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-white font-bold text-2xl leading-snug">
                                Tabriklaymiz, videodarsliklarni<br/>muvaffaqiyatli tamomladingiz
                            </h1>
                            <p className="text-gray-400 text-sm">Sertifikatni olish uchun pastdagi tugmani bosing.</p>

                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#2196F3] text-white font-semibold text-sm hover:bg-[#1976D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Download size={17}/>
                                {downloading ? 'Yuklanmoqda...' : 'Yuklab olish'}
                            </button>
                        </div>

                        {/* Review form */}
                        <div className="bg-[#121a24] rounded-2xl border border-[#1d2733] p-6">
                            <h2 className="text-white font-bold text-xl mb-5">Kursga baho bering</h2>

                            {submitted ? (
                                <div className="flex items-center gap-3 text-green-400 py-4">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span className="font-medium">Izohingiz muvaffaqiyatli yuborildi!</span>
                                </div>
                            ) : (
                                <>
                                    {/* Stars */}
                                    <div className="flex items-center gap-2 mb-5">
                                        {Array.from({length: 5}).map((_, i) => (
                                            <button
                                                key={i}
                                                onMouseEnter={() => setHoverRating(i + 1)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(i + 1)}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={34}
                                                    fill={i < (hoverRating || rating) ? '#F59E0B' : '#2A2D35'}
                                                    className={
                                                        i < (hoverRating || rating)
                                                            ? 'text-yellow-400'
                                                            : 'text-[#2A2D35]'
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Comment */}
                                    <div className="mb-5">
                                        <label className="block text-sm text-gray-400 mb-2">Izoh</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Izoh qoldiring"
                                            rows={5}
                                            className="w-full bg-[#0D1222] border border-[#1d2733] text-white text-sm rounded-xl px-4 py-3 outline-none resize-none placeholder:text-gray-600 focus:border-[#2196F3]/50 transition-colors"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={!rating || submitting}
                                            className="px-8 py-3 rounded-xl bg-[#2196F3] text-white font-semibold text-sm hover:bg-[#1976D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-4">
                        <YouthCard/>

                        {/* Yoshlar ishlari agentligi card */}
                        <div className="bg-[#0D1628] rounded-2xl border border-[#1d2733] overflow-hidden">
                            <div className="px-5 py-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-full bg-[#1A2535] border border-[#2A3545] flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold leading-tight">YOSHLAR ISHLARI</p>
                                        <p className="text-gray-400 text-[10px]">AGENTLIGI</p>
                                    </div>
                                </div>

                                {/* News item placeholder */}
                                <div className="space-y-2 mb-4">
                                    <div className="w-full aspect-video bg-[#162035] rounded-lg"/>
                                </div>

                                <p className="text-white text-sm font-semibold mb-3">
                                    Yoshlarga oid yangiliklarni biz bilan kuzating
                                </p>

                                <a
                                    href="https://yoshlar.gov.uz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2196F3] text-sm hover:underline"
                                >
                                    yoshlar.gov.uz
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}