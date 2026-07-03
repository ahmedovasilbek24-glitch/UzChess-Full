'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import axios from 'axios';

import AuthCard from '@/features/auth/components/AuthCard';
import PhoneField from '@/features/auth/components/PhoneField';
import SpinnerIcon from '@/features/auth/components/SpinnerIcon';

const BASE = 'http://localhost:3002';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const rawDigits = phone.replace(/\D/g, '');
    const fullPhone = '+998' + rawDigits;
    const canSubmit = rawDigits.length >= 9;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setError('');
        try {
            await axios.post(`${BASE}/auth/resend-otp`, {
                login: fullPhone,
                loginType: 'number'
            });
            router.push(`/auth/forgot-password/reset?phone=${encodeURIComponent(fullPhone)}`);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message ?? err.response?.data?.error;
                setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Xatolik yuz berdi'));
            } else {
                setError('Xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard onClose={() => router.push('/auth/sign-in')}>
            <h1 className="text-white font-bold text-lg mb-4">Parolni tiklash</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <PhoneField
                    value={phone}
                    onChange={v => {
                        setError('');
                        setPhone(v);
                    }}
                    error={!!error}
                    autoFocus
                />

                {error && <p className="text-xs -mt-1 text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-1 bg-[#2EA6FF] text-white disabled:opacity-60 transition-opacity"
                >
                    {loading ? <><SpinnerIcon/>Yuklanmoqda...</> : 'Davom etish'}
                </button>
            </form>
        </AuthCard>
    );
}