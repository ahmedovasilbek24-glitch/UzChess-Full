'use client';

import {useEffect, useState} from 'react';
import {ShoppingCart} from 'lucide-react';

import api from '@/lib/api';
import CartItem, {CartItemData} from '@/features/carts/components/CartItem';
import CartSummary from '@/features/carts/components/CartSummary';
import CartForm from '@/features/carts/components/Cart-from';
import OrderSuccessModal, {OrderSuccessModalProps} from '@/features/carts/components/OrderSuccessModal';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

function generateOrderCode(): string {
    return Array.from({length: 11}, () => Math.floor(Math.random() * 10)).join('');
}

type Step = 'cart' | 'details';

export default function CartPage() {
    const [items, setItems] = useState<CartItemData[]>([]);
    const [loading, setLoading] = useState(() => Boolean(getToken()));
    const [orderLoading, setOrderLoading] = useState(false);
    const [step, setStep] = useState<Step>('cart');
    const [orderCode, setOrderCode] = useState<string | null>(null);
    const [coupon, setCoupon] = useState('');

    useEffect(() => {
        const token = getToken();
        if (!token) return;
        api.get('/public/cart')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                setItems(data);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    function handleRemove(id: number) {
        setItems(prev => prev.filter(item => item.id !== id));
        api.delete(`/public/cart/${id}`).catch(() => {
        });
    }

    function handleQuantityChange(id: number, qty: number) {
        if (qty < 1) return;
        setItems(prev => prev.map(item => item.id === id ? {...item, quantity: qty} : item));
        api.patch(`/public/cart/${id}`, {quantity: qty}).catch(() => {
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function handleOrder(_: { fullName: string; phone: string; email: string }) {
        setOrderLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setItems([]);
        setOrderCode(generateOrderCode());
        setOrderLoading(false);
    }

    function handleModalClose() {
        setOrderCode(null);
        setStep('cart');
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.item.price) * item.quantity, 0);
    const discount = Math.round(subtotal * 0.1);
    const total = subtotal - discount;

    const summary = {
        total,
        delivery: null,
        deliveryPrice: null,
        subtotal,
        discount,
        coupon,
        paymentMethod: null,
    };

    if (loading) return (
        <div className="min-h-screen px-6 py-8">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[110px] bg-[#1A1D21] rounded-2xl animate-pulse"/>
                    ))}
                </div>
                <div className="h-[360px] bg-[#1A1D21] rounded-2xl animate-pulse"/>
            </div>
        </div>
    );

    return (
        <>
            {orderCode && (() => {
                const props: OrderSuccessModalProps = {orderCode, onClose: handleModalClose};
                return <OrderSuccessModal {...props} />;
            })()}

            {step === 'cart' && (
                <div className="min-h-screen px-6 py-8">
                    <div className="max-w-[1200px] mx-auto">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div
                                    className="w-24 h-24 rounded-full bg-[#111417] border border-[#1E2328] flex items-center justify-center">
                                    <ShoppingCart size={40} className="text-[#3A4050]"/>
                                </div>
                                <div className="text-center">
                                    <p className="text-white text-xl font-semibold mb-2">Savatcha bo&apos;sh</p>
                                    <p className="text-[#8A8F98] text-sm">Kitob yoki kurslarni savatchaga
                                        qo&apos;shing</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
                                <div className="flex flex-col gap-3">
                                    {items.map(item => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onRemove={handleRemove}
                                            onQuantityChange={handleQuantityChange}
                                        />
                                    ))}
                                </div>
                                <CartSummary
                                    items={items}
                                    onCheckout={() => setStep('details')}
                                    onCouponApply={setCoupon}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {step === 'details' && (
                <div className="min-h-screen px-6 py-8">
                    <div className="max-w-[1200px] mx-auto">
                        <CartForm
                            onSubmit={handleOrder}
                            onCancel={() => setStep('cart')}
                            loading={orderLoading}
                            summary={summary}
                        />
                    </div>
                </div>
            )}
        </>
    );
}