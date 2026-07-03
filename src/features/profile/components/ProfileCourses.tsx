'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

const BASE = 'http://localhost:3002';

interface Course {
    id: number;
    title: string;
    image?: string;
    author?: { fullName?: string };
    level?: string;
    lessonsCount?: number;
}

function Spinner() {
    return (
        <div className="flex items-center justify-center h-64">
            <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24" style={{ color: '#fff' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>
    );
}

function Empty() {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: '#0D1117', border: '1px solid #1A2030' }}>
                ♟
            </div>
            <div className="text-center">
                <p className="font-semibold text-white mb-1">Sotib olingan kurslar yo&apos;q</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Kurslarni sotib oling va bu yerda ko&apos;ring</p>
            </div>
            <Link href="/courses" className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#fff', color: '#000' }}>
                Kurslarga o&apos;tish
            </Link>
        </div>
    );
}

export default function ProfileCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/courses/purchased')
            .then(r => setCourses(r.data?.data ?? r.data ?? []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;
    if (!courses.length) return <Empty />;

    return (
        <div className="grid grid-cols-2 gap-4">
            {courses.map(course => (
                <Link key={course.id} href={`/courses/${course.id}`}
                    className="rounded-2xl overflow-hidden transition-all group"
                    style={{ background: '#0D1117', border: '1px solid #1A2030' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1F2937'; }}>

                    <div className="relative h-36 overflow-hidden flex items-center justify-center text-4xl"
                        style={{ background: '#0D1117' }}>
                        {course.image
                            ? <Image src={course.image.startsWith('http') ? course.image : `${BASE}/${course.image.replace(/\\/g, '/')}`}
                                alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            : '♟'}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(46,166,255,0.9)' }}>
                                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col gap-1.5">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug">
                            {course.title}
                        </h3>
                        {course.author?.fullName && (
                            <p className="text-xs" style={{ color: '#6B7280' }}>{course.author.fullName}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#6B7280' }}>
                            {course.level && (
                                <span className="px-2 py-0.5 rounded-md" style={{ background: '#1F2937' }}>
                                    {course.level}
                                </span>
                            )}
                            {course.lessonsCount && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {course.lessonsCount} ta dars
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}