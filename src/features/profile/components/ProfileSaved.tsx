'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSavedCourses, getSavedBooks, type SavedCourse, type SavedBook } from '@/lib/saved';

const BASE = 'http://localhost:3002';

type Tab = 'courses' | 'books';
type SavedItem = SavedCourse | SavedBook;

const TABS: { key: Tab; label: string }[] = [
    { key: 'courses', label: 'Saqlangan kurslar' },
    { key: 'books',   label: 'Saqlangan kitoblar' },
];

function Empty({ tab }: { tab: Tab }) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: '#0D1117', border: '1px solid #1A2030' }}>
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#374151' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <div className="text-center">
                <p className="font-semibold text-white mb-1">
                    {tab === 'courses' ? "Saqlangan kurslar yo'q" : "Saqlangan kitoblar yo'q"}
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                    {tab === 'courses' ? 'Kurslarni saqlang va bu yerda ko\'ring' : 'Kitoblarni saqlang va bu yerda ko\'ring'}
                </p>
            </div>
        </div>
    );
}

function normalizeImage(img?: string) {
    if (!img) return '';
    return img.startsWith('http') ? img : `${BASE}/${img.replace(/\\/g, '/')}`;
}

export default function ProfileSaved() {
    const [tab, setTab] = useState<Tab>('courses');
    const [items, setItems] = useState<SavedItem[]>([]);

    useEffect(() => {
        setItems(tab === 'courses' ? getSavedCourses() : getSavedBooks());
    }, [tab]);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-2">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{
                            background: tab === t.key ? '#fff' : '#141920',
                            color:      tab === t.key ? '#000'    : '#6B7280',
                            border:     `1px solid ${tab === t.key ? '#fff' : '#1F2937'}`,
                        }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {!items.length ? (
                <Empty tab={tab} />
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {items.map(item => (
                        <Link key={item.id}
                            href={tab === 'courses' ? `/courses/${item.id}` : `/library/${item.id}`}
                            className="rounded-2xl overflow-hidden group transition-all"
                            style={{ background: '#0D1117', border: '1px solid #1A2030' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1F2937'; }}>

                            <div className="relative h-36 overflow-hidden flex items-center justify-center text-4xl"
                                style={{ background: '#0D1117' }}>
                                {item.image
                                    ? <Image src={normalizeImage(item.image)} alt={item.title ?? ''}
                                        fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                    : '♟'}
                                <button className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center z-10"
                                    style={{ background: 'rgba(0,0,0,0.55)' }}
                                    onClick={e => e.preventDefault()}>
                                    <svg className="w-4 h-4" fill="#10B981" viewBox="0 0 24 24">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-4 flex flex-col gap-1.5">
                                <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug">
                                    {item.title}
                                </h3>
                                {item.author?.fullName && (
                                    <p className="text-xs" style={{ color: '#6B7280' }}>{item.author.fullName}</p>
                                )}
                                <div className="flex items-center gap-3 text-xs" style={{ color: '#6B7280' }}>
                                    {item.level && (
                                        <span className="px-2 py-0.5 rounded-md" style={{ background: '#1F2937' }}>
                                            {item.level}
                                        </span>
                                    )}
                                    {('lessonsCount' in item) && item.lessonsCount && (
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {('lessonsCount' in item) ? item.lessonsCount : ''} ta dars
                                        </span>
                                    )}
                                    {item.rating !== undefined && (
                                        <span className="flex items-center gap-0.5">
                                            <svg className="w-3 h-3" fill="#F59E0B" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {item.rating}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}