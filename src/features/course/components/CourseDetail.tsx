"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Bookmark,
    Award, Play,
} from "lucide-react";

import CourseReviews from "./CourseReviews";
import YouthCard from "@/features/shared/components/YouthCard/YouthCard";
import { toggleSavedCourse, isSavedCourse } from "@/lib/saved";

const BASE = "http://localhost:3002";

interface Props { course: any; }
interface Section { id: number; title: string; order: number | null; }
interface Lesson {
    id: number; courseSectionId: number; title: string;
    thumbnail: string | null; video: string; isFree: boolean;
    order: number | null; duration?: number;
}

const LESSON_THUMBS = [
    "/lessons/lesson-thumb-1.png",
    "/lessons/lesson-thumb-2.png",
    "/lessons/lesson-thumb-3.png",
];

function norm(image?: string) {
    if (!image) return "";
    const s = image.replace(/\\/g, "/");
    return s.startsWith("http") ? s : `${BASE}/${s}`;
}

function fmtDur(sec?: number) {
    if (!sec) return "07:20";
    return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

function fmtPrice(val: number | string) {
    const n = Number(val);
    if (isNaN(n)) return String(val);
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

type PurchaseStep = "select" | "processing" | "success" | "fail";
type PayMethod = "paylov" | "payme" | "click" | "uzum";

export default function CourseDetail({ course }: Props) {
    const router = useRouter();
    const [sections, setSections] = useState<Section[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [openSection, setOpenSection] = useState<number | null>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [saved, setSaved] = useState(() => isSavedCourse(course?.id));
    const [lastLesson, setLastLesson] = useState<Lesson | null>(null);

    /* Purchase modal */
    const [showPurchase, setShowPurchase] = useState(false);
    const [purchaseStep, setPurchaseStep] = useState<PurchaseStep>("select");
    const [payMethod, setPayMethod] = useState<PayMethod>("paylov");

    /* Share modal */
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== "undefined" ? window.location.href : `https://uzchess.uz/kurslar/${course?.id}`;

    function copyUrl() {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    function openBuy() {
        setPurchaseStep("select");
        setPayMethod("paylov");
        setShowPurchase(true);
    }

    async function handleBuy() {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowPurchase(false);
            router.push("/auth/sign-in");
            return;
        }
        setPurchaseStep("processing");
        try {
            let userId: number | undefined;
            try { const p = JSON.parse(atob(token.split(".")[1])); userId = p.id ?? p.userId ?? p.sub; } catch {}
            await axios.post(`${BASE}/admin/purchasedCourse`,
                { courseId: course.id, userId: Number(userId), date: new Date().toISOString() },
                { headers: { Authorization: `Bearer ${token}` } });
            setPurchaseStep("success");
            setIsPurchased(true);
        } catch {
            setPurchaseStep("fail");
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios.get(`${BASE}/public/purchasedCourse`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => {
                const list = Array.isArray(r.data?.data) ? r.data.data
                    : Array.isArray(r.data) ? r.data : [];
                setIsPurchased(list.some((x: any) =>
                    Number(x.courseId) === Number(course.id) ||
                    Number(x.course?.id) === Number(course.id)
                ));
            }).catch(() => {});
    }, [course.id]);

    useEffect(() => {
        Promise.all([
            fetch(`${BASE}/public/courseSection`).then(r => r.json()),
            fetch(`${BASE}/public/courseLesson`).then(r => r.json()),
        ]).then(([sd, ld]) => {
            const allSections: Section[] = Array.isArray(sd?.data) ? sd.data : Array.isArray(sd?.items) ? sd.items : Array.isArray(sd) ? sd : [];
            const allLessons: Lesson[] = Array.isArray(ld?.data) ? ld.data : Array.isArray(ld?.items) ? ld.items : Array.isArray(ld) ? ld : [];
            const sArr = allSections.filter(s => Number((s as any).courseId) === Number(course.id));
            const lArr = allLessons.filter(l => Number((l as any).courseId) === Number(course.id));
            setSections(sArr);
            setLessons(lArr);
            if (sArr.length > 0) setOpenSection(sArr[0].id);
            if (lArr.length > 0) setLastLesson(lArr[0]);
        }).catch(() => {});
    }, [course.id]);

    function handleSave() {
        toggleSavedCourse({ id: course.id, title: course.title, image: course.image, author: course.author, rating: course.rating, lessonsCount: course.lessonsCount });
        setSaved(v => !v);
    }

    const newPrice = Number(course.newPrice ?? course.price ?? 0);
    const oldPrice = Number(course.price ?? 0);
    const isFree = newPrice === 0;
    const hasDiscount = !isFree && course.newPrice && course.price && newPrice !== oldPrice;

    const payMethods: { id: PayMethod; logo: string; w: number; h: number }[] = [
        { id: "paylov", logo: "/payments/paylov-logo.svg", w: 61, h: 20 },
        { id: "payme",  logo: "/payments/payme-logo.svg", w: 70, h: 24 },
        { id: "click",  logo: "/payments/click-logo.svg", w: 71, h: 24 },
        { id: "uzum",   logo: "/payments/uzum-logo.svg", w: 60, h: 24 },
    ];


    return (
        <>
            <div className="min-h-screen bg-black text-white">
                <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
                    <div className="relative mb-8 min-h-[194px] overflow-hidden rounded-[28px] border border-[#1d2733] bg-[#0d1117]">
                        <div className="absolute inset-0">
                            {course.image && (
                                <Image src={norm(course.image)} alt={course.title} fill priority unoptimized className="object-cover" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

                        <div className="relative z-10 flex h-full flex-col justify-between gap-6 px-6 py-8 md:px-8">
                            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-start">
                                <div>
                                    <h1 className="text-[32px] font-bold leading-tight text-white">{course.title}</h1>
                                    <div className="mt-3 flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Image src="/wallet-icon.svg" alt="price" width={28} height={28} />
                                            {isFree ? (
                                                <span className="text-xl font-bold text-green-400">Bepul</span>
                                            ) : (
                                                <span className="text-xl font-bold text-white">{fmtPrice(newPrice)} uzs</span>
                                            )}
                                        </div>
                                        {hasDiscount && (
                                            <span className="text-sm text-white line-through decoration-[#DC2D2D]">{fmtPrice(oldPrice)} uzs</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Image
                                                key={i}
                                                src={i < Math.round(Number(course.rating)) ? "/star-filled.svg" : "/star-empty.svg"}
                                                alt="star"
                                                width={21}
                                                height={20}
                                            />
                                        ))}
                                    </div>
                                    <div className="h-4 w-px bg-[#1A2226]" />
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-medium text-white">{course.rating}</span>
                                        <span className="text-sm text-[#6D7275]">(234 ta izoh)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                                <div className="flex flex-wrap items-center gap-6 text-sm text-white">
                                    <div className="flex items-center gap-2">
                                        <Image src="/difficulty-icon.svg" alt="difficulty" width={24} height={24} />
                                        <span>{course.difficulty?.title || "Boshlang'ich"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Image src="/student-center-icon.svg" alt="sections" width={24} height={24} />
                                        <span>{course.sectionsCount ?? sections.length} ta bo'lim</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Image src="/play-icon.svg" alt="lessons" width={24} height={24} />
                                        <span>{course.lessonsCount ?? lessons.length} ta dars</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {isPurchased ? (
                                        <button onClick={() => router.push(`/courses/${course.id}/certificate`)} className="flex h-[50px] items-center gap-2 rounded-xl bg-[#1C92E0] px-8 text-[20px] font-medium text-white hover:bg-[#1876b8] transition-colors">
                                            <Award size={18} /> Sertifikat
                                        </button>
                                    ) : (
                                        <button onClick={openBuy} className="h-[50px] rounded-xl bg-[#1C92E0] px-8 text-[20px] font-medium text-white hover:bg-[#1876b8] transition-colors">
                                            Kursni sotib olish
                                        </button>
                                    )}
                                    <button onClick={handleSave} className={`flex h-[50px] w-[50px] items-center justify-center rounded-xl border transition-colors ${saved ? "border-[#1C92E0] bg-[#1C92E0]" : "border-[#2A2D35] bg-[#11151B] hover:bg-[#1A1F27]"}`}>
                                        <Bookmark size={20} className="text-white" fill={saved ? "white" : "none"} />
                                    </button>
                                    <button onClick={() => setShowShare(true)} className="flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-[#2A2D35] bg-[#11151B] hover:bg-[#1A1F27] transition-colors">
                                        <Image src="/share-icon.svg" alt="share" width={20} height={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="space-y-6">
                            <section className="overflow-hidden rounded-lg border border-[#1F272A] bg-[#1A1D1F]">
                                {(() => {
                                    let lessonIndex = 0;
                                    return sections.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((sec, si) => {
                                        const secLessons = lessons.filter(l => l.courseSectionId === sec.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                                        const isOpen = openSection === sec.id;
                                        return (
                                            <div key={sec.id} className={si > 0 ? "border-t border-[#282C2E]" : ""}>
                                                <button onClick={() => setOpenSection(isOpen ? null : sec.id)} className="flex w-full items-center justify-between px-5 py-3.5 text-left">
                                                    <span className="text-2xl font-bold text-white">{si + 1}. {sec.title}</span>
                                                    <Image
                                                        src="/chevron-up.svg"
                                                        alt="toggle"
                                                        width={32}
                                                        height={32}
                                                        className={isOpen ? "" : "rotate-180"}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="grid grid-cols-1 gap-6 bg-white/[0.03] p-5 sm:grid-cols-2 lg:grid-cols-3">
                                                        {secLessons.map((lesson, li) => {
                                                            const canWatch = lesson.isFree || isPurchased;
                                                            const thumb = lesson.thumbnail ? norm(lesson.thumbnail) : LESSON_THUMBS[lessonIndex % LESSON_THUMBS.length];
                                                            lessonIndex += 1;
                                                            return (
                                                                <div key={lesson.id} className="cursor-pointer" onClick={() => canWatch ? router.push(`/courses/${course.id}/lesson`) : openBuy()}>
                                                                    <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-white/[0.16] bg-[#1A1D1F]">
                                                                        <Image src={thumb} alt={lesson.title} fill unoptimized className="object-cover" />
                                                                        {!canWatch && <div className="absolute inset-0 flex items-center justify-center bg-black/55"><div className="rounded-full bg-black/70 p-3"><Play size={18} className="text-white" /></div></div>}
                                                                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sm text-white">
                                                                            <Image src="/lesson-play-icon.svg" alt="play" width={15} height={17} />
                                                                            <span>{fmtDur(lesson.duration)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xl font-medium text-white">{si + 1}.{li + 1} {lesson.title}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </section>

                            <CourseReviews />
                        </div>

                        <aside className="space-y-4">
                            <YouthCard />

                            {isPurchased && lastLesson && (
                                <div className="rounded-[24px] border border-[#1d2733] bg-[#121a24] p-5">
                                    <p className="mb-3 text-sm font-medium text-[#D8DEE8]">Siz shu videoni ko'ryotgan edingiz</p>
                                    <div className="relative aspect-video overflow-hidden rounded-2xl" onClick={() => router.push(`/courses/${course.id}/lesson`)}>
                                        {lastLesson.thumbnail ? <Image src={norm(lastLesson.thumbnail)} alt={lastLesson.title} fill unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center bg-[#1A2535]"><Play size={30} className="text-yellow-400/70" fill="rgba(250,204,21,0.7)" /></div>}
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] text-white">
                                            <Play size={10} fill="white" className="text-white" />
                                            <span>{fmtDur(lastLesson.duration)}</span>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-white">{lastLesson.title}</p>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>

            {/* ── Purchase modal ── */}
        {showPurchase && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
                <button onClick={() => setShowPurchase(false)}
                    className="absolute top-5 right-5 w-10 h-10 rounded-lg bg-[#1A1D1F] hover:bg-[#23272A] flex items-center justify-center z-10 transition-colors">
                    <Image src="/close-icon.svg" alt="close" width={20} height={20} />
                </button>

                <div className="w-full max-w-[440px] rounded-xl border border-[#1F272A] bg-[#1A1D1F] overflow-hidden">

                    {purchaseStep === "select" && (
                        <div className="p-8 flex flex-col items-center gap-5">
                            <Image src="/payment-icon.png" alt="payment" width={100} height={100} />

                            <div className="w-full rounded-xl border border-[#363A3D]/40 p-4 text-center">
                                <p className="text-[#9FA1A2] text-sm mb-2">Xarid qilinayotgan kurs:</p>
                                <p className="text-white font-bold text-xl mb-3 line-clamp-2">{course.title}</p>
                                <div className="flex items-center justify-center gap-2">
                                    {isFree ? (
                                        <span className="text-green-400 font-bold text-xl">Bepul</span>
                                    ) : (
                                        <>
                                            <Image src="/wallet-icon.svg" alt="price" width={28} height={28} />
                                            <span className="text-white font-bold text-xl">{fmtPrice(newPrice)} UZS</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="w-full">
                                <p className="text-[#9DA1A3] text-base font-medium mb-3">To&apos;lov usulini tanlang</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {payMethods.map(m => (
                                        <button key={m.id} onClick={() => setPayMethod(m.id)}
                                            className={`flex h-12 items-center justify-between rounded-lg border px-4 transition-colors ${payMethod === m.id ? "border-[#163D57] bg-[#1A2932]" : "border-[#363A3D]/40 bg-[#13181C]"}`}>
                                            <Image src={m.logo} alt={m.id} width={m.w} height={m.h} />
                                            <Image src={payMethod === m.id ? "/radio-selected.svg" : "/radio-unselected.svg"} alt="radio" width={24} height={24} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 w-full">
                                <button onClick={() => setShowPurchase(false)}
                                    className="flex-1 h-11 rounded-lg text-base font-medium bg-white text-[#14181C] hover:bg-white/90 transition-colors">
                                    Bekor qilish
                                </button>
                                <button onClick={handleBuy}
                                    className="flex-1 h-11 rounded-lg text-base font-medium bg-[#1C92E0] text-white hover:bg-[#1876b8] transition-colors">
                                    Davom etish
                                </button>
                            </div>
                        </div>
                    )}

                    {purchaseStep === "processing" && (
                        <div className="p-8 flex flex-col items-center gap-5 text-center">
                            <Image src="/processing-icon.svg" alt="processing" width={140} height={140} className="-my-5" />
                            <h3 className="text-white font-bold text-2xl">Jarayonda...</h3>
                            <p className="text-[#9DA1A3] text-base">To&apos;lov amalga oshish jarayonida</p>
                            <button onClick={() => setShowPurchase(false)}
                                className="w-full h-11 rounded-lg bg-[#1C92E0] text-white font-medium text-base hover:bg-[#1876b8] transition-colors">
                                Tushunarli
                            </button>
                        </div>
                    )}

                    {purchaseStep === "success" && (
                        <div className="p-8 flex flex-col items-center gap-5 text-center">
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-2xl leading-snug">Kurs muvaffaqiyatli sotib olindi</h3>
                            <p className="text-gray-400 text-sm">Tabriklaymiz siz kursni muvaffaqiyatli sotib oldingiz!</p>
                            <button onClick={() => { setShowPurchase(false); router.push(`/courses/${course.id}/lesson`); }}
                                className="w-full py-3 rounded-xl bg-[#2196F3] text-white font-semibold text-sm hover:bg-[#1976D2] transition-colors">
                                Kursni ko&apos;rish
                            </button>
                        </div>
                    )}

                    {purchaseStep === "fail" && (
                        <div className="p-8 flex flex-col items-center gap-5 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-2xl">Xatolik yuz berdi</h3>
                            <p className="text-gray-400 text-sm">Kursni sotib olish jarayonida xatolik yuz berdi. Iltimos qayta urunib ko&apos;ring</p>
                            <button onClick={() => setPurchaseStep("select")}
                                className="w-full py-3 rounded-xl bg-[#2196F3] text-white font-semibold text-sm hover:bg-[#1976D2] transition-colors">
                                Qayta urunib ko&apos;rish
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {showShare && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
                onClick={() => setShowShare(false)}>
                <div className="w-full max-w-[430px] bg-[#1C2028] rounded-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}>

                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2D35]">
                        <h3 className="text-white font-bold text-lg">Ulashish</h3>
                        <button onClick={() => setShowShare(false)}
                            className="w-8 h-8 rounded-full hover:bg-[#2A2D35] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        <div className="bg-[#13151C] rounded-xl py-4 flex items-center justify-center gap-8">
                            {[
                                { label: "Instagram", icon: (<svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>) },
                                { label: "Telegram", icon: (<svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>) },
                                { label: "Twitter", icon: (<svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>) },
                                { label: "Facebook", icon: (<svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>) },
                            ].map(s => (
                                <button key={s.label} className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                                    {s.icon}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-[#13151C] rounded-xl px-4 py-3 border border-[#2A2D35]">
                            <span className="flex-1 text-sm text-gray-300 truncate">{shareUrl}</span>
                            <button onClick={copyUrl}
                                className="flex-shrink-0 w-9 h-9 bg-[#2A2D35] hover:bg-[#3A3D45] rounded-lg flex items-center justify-center transition-colors">
                                {copied ? (
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}