"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, BookOpen, CalendarDays } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { toggleSavedBook, isSavedBook } from "@/lib/saved";
import { useSetBreadcrumb } from "@/features/shared/context/BreadcrumbContext";

function fmtPrice(val: number | string) {
    const n = Number(val);
    if (isNaN(n)) return String(val);
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

interface Props {
    book: any;
}

export default function BookDetail({ book }: Props) {
    const router = useRouter();
    useSetBreadcrumb(book?.title);
    const [isLiked, setIsLiked] = useState<boolean>(() => isSavedBook(book?.id) || (book?.isLiked ?? false));
    const [loading, setLoading] = useState<boolean>(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartAdded, setCartAdded] = useState(false);

    async function handleAddToCart() {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/auth/sign-in"); return; }
        if (cartLoading) return;
        try {
            setCartLoading(true);
            await api.post("/public/cart", { target: "book", targetId: book.id, quantity: 1 });
            setCartAdded(true);
        } catch (err) {
            console.error("Cart error:", err);
        } finally {
            setCartLoading(false);
        }
    }

    const imageSrc = book?.image
        ? `http://localhost:3002/${book.image.replace(/\\/g, '/')}`
        : '/placeholder-book.png';

    const newPrice = Number(book?.newPrice ?? book?.price ?? 0);
    const oldPrice = Number(book?.price ?? 0);
    const isFree = newPrice === 0;
    const hasDiscount = !isFree && book?.newPrice && book?.price && newPrice !== oldPrice;

    const handleLikeToggle = async () => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/auth/sign-in'); return; }
        if (loading) return;
        setLoading(true);
        try {
            await fetch(`http://localhost:3002/public/book-like/${book.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({}),
            });
            toggleSavedBook({ id: book.id, title: book.title, image: book.image, author: book.author?.fullName ? { fullName: book.author.fullName } : undefined, rating: book.rating });
            setIsLiked(v => !v);
        } catch (error) {
            console.error('Xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1A1D1F] border border-[#1F272A] rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="w-[195px] shrink-0">
                    <Image
                        src={imageSrc}
                        alt={book.title}
                        height={238}
                        width={195}
                        priority
                        className="h-[238px] w-[195px] object-cover rounded"
                    />
                </div>

                <div className="flex-1">
                    <h1 className="text-white text-3xl font-bold leading-tight mb-4">{book.title}</h1>

                    <div className="flex items-center gap-3 mb-6">
                        <Image src="/wallet-icon.svg" alt="price" width={24} height={24} />
                        {isFree ? (
                            <span className="text-xl font-bold text-green-400">Bepul</span>
                        ) : (
                            <span className="text-xl font-bold text-white">{fmtPrice(newPrice)} UZS</span>
                        )}
                        {hasDiscount && (
                            <span className="text-sm text-[#E2734C] line-through">{fmtPrice(oldPrice)} uzs</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#1D2940] rounded-xl overflow-hidden mb-8">
                        <div className="p-4 border-r border-b lg:border-b-0 border-[#1D2940]">
                            <div className="flex items-center gap-2 text-[#9DA1A3] text-sm">
                                <Image src="/difficulty-icon.svg" alt="daraja" width={18} height={18} />
                                <span>Daraja</span>
                            </div>
                            <p className="text-white mt-1 font-medium">{book.difficulty?.title}</p>
                        </div>
                        <div className="p-4 border-b lg:border-b-0 lg:border-r border-[#1D2940]">
                            <div className="flex items-center gap-2 text-[#9DA1A3] text-sm">
                                <Image src="/user-icon.svg" alt="muallif" width={18} height={18} />
                                <span>Muallif</span>
                            </div>
                            <p className="text-white mt-1 font-medium">{book.author?.fullName}</p>
                        </div>
                        <div className="p-4 border-r border-[#1D2940]">
                            <div className="flex items-center gap-2 text-[#9DA1A3] text-sm">
                                <BookOpen size={16} />
                                <span>Sahifa soni</span>
                            </div>
                            <p className="text-white mt-1 font-medium">{book.pages}</p>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 text-[#9DA1A3] text-sm">
                                <CalendarDays size={16} />
                                <span>Chop etilgan sana</span>
                            </div>
                            <p className="text-white mt-1 font-medium">{book.pubDate?.slice(0, 4)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                            className="flex h-[50px] items-center gap-2 rounded-lg bg-[#1C92E0] px-8 font-medium text-white transition-colors hover:bg-[#1876b8] disabled:opacity-50"
                        >
                            <Image
                                src={cartAdded ? "/cart add.png" : "/cart.png"}
                                alt="cart"
                                width={20}
                                height={20}
                            />
                            <span>Savatchaga</span>
                        </button>

                        <button
                            onClick={handleLikeToggle}
                            disabled={loading}
                            className={`flex h-[50px] w-[50px] items-center justify-center rounded-lg border transition-colors ${
                                isLiked ? "bg-[#1C92E0] border-[#1C92E0]" : "border-[#2A2D35] hover:bg-white/10"
                            }`}
                        >
                            <Heart size={20} className="text-white" fill={isLiked ? "white" : "none"} />
                        </button>

                        <button className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-[#2A2D35] hover:bg-white/10 transition-colors">
                            <Image src="/share-icon.svg" alt="share" width={20} height={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-white text-2xl font-bold mb-4">Kitob haqida</h2>
                <p className="text-gray-400 leading-8">{book.description}</p>
            </div>
        </div>
    );
}