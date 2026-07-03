'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

const BASE = 'http://localhost:3002';

interface OrderItem {
    title?: string;
    image?: string;
    category?: string;
    price?: number;
}

interface Order {
    id: number;
    orderNumber?: string;
    status?: string;
    totalPrice?: number;
    items?: OrderItem[];
    createdAt?: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    delivered:  { label: 'Yetkazib berildi',            color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    pending:    { label: 'Buyurtma kutilmoqda',          color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    cancelled:  { label: 'Bekor qilingan',               color: '#EF4444', bg: 'rgba(239,68,68,0.1)'  },
    processing: { label: 'Jarayonda',                    color: '#2EA6FF', bg: 'rgba(46,166,255,0.1)' },
};

function normalizeImg(src?: string) {
    if (!src) return '';
    return src.startsWith('http') ? src : `${BASE}/${src.replace(/\\/g, '/')}`;
}

function Spinner() {
    return (
        <div className="flex items-center justify-center h-64">
            <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24" style={{ color: '#2EA6FF' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>
    );
}

function Empty() {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: '#0D1117', border: '1px solid #1A2030' }}>
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#374151' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            <div className="text-center">
                <p className="font-semibold text-white mb-1">Buyurtmalar yo&apos;q</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Hali hech narsa buyurtma qilmadingiz</p>
            </div>
        </div>
    );
}

export default function ProfileOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders')
            .then(r => setOrders(r.data?.data ?? r.data ?? []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;
    if (!orders.length) return <Empty />;

    return (
        <div className="flex flex-col gap-3">
            {orders.map(order => {
                const st = STATUS_MAP[order.status ?? ''] ?? { label: order.status ?? '—', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
                const firstItem = order.items?.[0];
                const extraCount = (order.items?.length ?? 1) - 1;
                const date = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : null;

                return (
                    <div key={order.id} className="rounded-2xl p-4"
                        style={{ background: '#0D1117', border: '1px solid #1A2030' }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-sm">
                                    № {order.orderNumber ?? order.id}
                                </span>
                                {date && (
                                    <span className="text-xs" style={{ color: '#4B5563' }}>{date}</span>
                                )}
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                                style={{ color: st.color, background: st.bg }}>
                                {st.label}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl"
                                style={{ background: '#0073ff' }}>
                                {firstItem?.image
                                    ? <Image src={normalizeImg(firstItem.image)} alt={firstItem.title ?? ''}
                                        width={56} height={56} className="w-full h-full object-cover" />
                                    : '♟'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium line-clamp-1">
                                    {firstItem?.title ?? '—'}
                                </p>
                                {firstItem?.category && (
                                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{firstItem.category}</p>
                                )}
                                {extraCount > 0 && (
                                    <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>
                                        +{extraCount} ta mahsulot
                                    </p>
                                )}
                            </div>
                            {order.totalPrice !== undefined && (
                                <div className="flex-shrink-0 text-right">
                                    <p className="font-bold text-sm" style={{ color: '#fff' }}>
                                        {order.totalPrice.toLocaleString()}
                                    </p>
                                    <p className="text-xs" style={{ color: '#6B7280' }}>UZS</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}