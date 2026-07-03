'use client';

import api from '@/lib/api';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toggleSavedCourse, isSavedCourse } from '@/lib/saved';

interface Course {
    id: number;
    title: string;
    image: string;
    price: number;
    newPrice: number;
    rating: number;
    lessonsCount: number;
    isLiked?: boolean;

    author?: {
        fullName: string;
    };

    language?: {
        code: string;
    };

    difficulty?: {
        title: string;
        icon: string;
    };

    category?: {
        title: string;
    };
}

interface Props {
    course: Course;
}

function normalizeImageSrc(image?: string) {
    if (!image) return "";

    const normalized = image.replace(/\\/g, "/");

    return normalized.startsWith("http")
        ? normalized
        : `http://localhost:3002/${normalized}`;
}

export default function CourseCard({ course }: Props) {
    const [liked, setLiked] = useState(() => isSavedCourse(course.id) || (course.isLiked ?? false));
    const [loading, setLoading] = useState(false);
    async function handleLike(
        e: React.MouseEvent<HTMLButtonElement>
    ) {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Avval login qiling!');
            return;
        }

        const prevLiked = liked;

        try {
            setLoading(true);
            setLiked(!prevLiked);
            toggleSavedCourse({ id: course.id, title: course.title, image: course.image, author: course.author, rating: course.rating, lessonsCount: course.lessonsCount });
            await api.post(`/public/course-like/${course.id}`, {});
        } catch (error) {
            console.error('Like error:', error);
            setLiked(prevLiked);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Link
            href={`/courses/${course.id}`}
            className="block"
        >
            <div className="w-full bg-[#14181C] border border-[#1E2328] rounded-2xl p-5 flex gap-6 hover:border-[#2196F3] transition-all">

                <div
                    className="relative flex-shrink-0 self-start rounded-xl overflow-hidden"
                    style={{ width: '280px', height: '190px' }}
                >
                    <Image
                        src={normalizeImageSrc(course.image)}
                        alt={course.title}
                        fill
                        className="object-cover"
                    />

                    <div className="absolute top-3 left-2 bg-black/70 text-yellow-400 text-xs px-2.5 py-1 rounded-lg font-semibold backdrop-blur-sm">
                        ⭐ {course.rating}
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm font-medium">
                        {course.language?.code}
                    </div>
                </div>

                <div className="flex flex-col flex-1 justify-between py-1">

                    <div>
                        <h2 className="text-white text-2xl font-bold leading-snug">
                            {course.title}
                        </h2>

                        <p className="text-[#8A8F98] text-base mt-2">
                            {course.author?.fullName}
                        </p>

                        <div className="mt-3">
                            {Number(course.price) > 0 &&
                                Number(course.price) !== Number(course.newPrice) && (
                                    <p className="text-gray-500 line-through text-lg">
                                        {Number(course.price).toLocaleString()} UZS
                                    </p>
                                )}

                            <p className="text-[#84CC16] font-bold text-xl">
                                {Number(course.newPrice) === 0
                                    ? 'Bepul kurs'
                                    : `${Number(course.newPrice).toLocaleString()} UZS`}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4 text-[#8A8F98] text-sm">

                            <div className="flex items-center gap-2">
                                {course.difficulty?.icon && (
                                    <Image
                                        src={normalizeImageSrc(course.difficulty.icon)}
                                        alt="difficulty"
                                        width={20}
                                        height={20}
                                    />
                                )}

                                <span>
                                    {course.difficulty?.title}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Image
                                    src="/student_center.png"
                                    alt="lessons"
                                    width={16}
                                    height={16}
                                />

                                <span>
                                    {course.lessonsCount} ta bo'lim
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Image
                                    src="/grid1.png"
                                    alt="category"
                                    width={16}
                                    height={16}
                                />

                                <span>
                                    {course.category?.title}
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-5">
                        <button
                            onClick={handleLike}
                            disabled={loading}
                            className="transition-all hover:scale-110 disabled:opacity-50"
                        >
                            <Image
                                src={liked ? '/heart-filled.png' : '/heart-outline.png'}
                                alt="heart"
                                width={26}
                                height={26}
                            />
                        </button>
                    </div>

                </div>
            </div>
        </Link>
    );
}