'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';

const BASE = 'http://localhost:3002';

interface Props {
    onClose: () => void;
    defaultTab?: 'login' | 'register';
}

export default function AuthModal({ onClose, defaultTab = 'login' }: Props) {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>(defaultTab);
    const [tab, setTab]   = useState<'phone' | 'email'>('phone');

    /* login fields */
    const [phone,    setPhone]    = useState('');
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [showPwd,  setShowPwd]  = useState(false);

    /* register fields */
    const [name,     setName]     = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [terms,    setTerms]    = useState(false);

    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const rawDigits    = phone.replace(/\D/g, '');
    const rawRegDigits = regPhone.replace(/\D/g, '');

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (tab === 'phone' && rawDigits.length < 9) { setError("Telefon raqamini to'liq kiriting"); return; }
        if (tab === 'email' && !email.trim())         { setError('Elektron pochtani kiriting'); return; }
        if (!password)                                 { setError('Parolni kiriting'); return; }
        setLoading(true); setError('');
        const loginVal = tab === 'phone' ? ('+998' + rawDigits) : email.trim();
        try {
            const res = await axios.post(`${BASE}/auth/sign-in`, { login: loginVal, password });
            const token = res.data?.accessToken ?? res.data?.access_token ?? res.data?.token ?? res.data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                window.dispatchEvent(new Event('auth-change'));
                onClose();
                router.refresh();
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const msg = err.response?.data?.message ?? err.response?.data?.error ?? '';
                if (status === 401) setError("Login yoki parol noto'g'ri");
                else setError(Array.isArray(msg) ? msg[0] : (msg || 'Xatolik yuz berdi'));
            } else { setError('Xatolik yuz berdi'); }
        } finally { setLoading(false); }
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim())                    { setError("Ismingizni kiriting"); return; }
        if (rawRegDigits.length < 9)         { setError("Telefon raqamini to'liq kiriting"); return; }
        if (!terms)                          { setError("Foydalanish shartlarini qabul qiling"); return; }
        setLoading(true); setError('');
        try {
            const res = await axios.post(`${BASE}/auth/sign-up`, {
                fullName: name.trim(),
                phone: '+998' + rawRegDigits,
            });
            const token = res.data?.accessToken ?? res.data?.access_token ?? res.data?.token ?? res.data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                window.dispatchEvent(new Event('auth-change'));
                onClose();
                router.refresh();
            } else {
                setMode('login');
                setError('');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message ?? err.response?.data?.error ?? '';
                setError(Array.isArray(msg) ? msg[0] : (msg || 'Xatolik yuz berdi'));
            } else { setError('Xatolik yuz berdi'); }
        } finally { setLoading(false); }
    }

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>

            {/* Top bar: logo + close */}
            <div className="w-full flex items-center justify-center relative mb-5 px-6" style={{ height: '44px' }}>
                <Link href="/" onClick={onClose} className="flex items-center gap-2">
                    <Image src="/uzchess.png" alt="UzChess" width={120} height={32} className="h-8 w-auto object-contain" />
                </Link>
                <button
                    onClick={onClose}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1D21] hover:bg-[#2A2D31] text-white transition-colors cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Modal card */}
            <div className="w-full max-w-[820px] mx-4 rounded-2xl overflow-hidden shadow-2xl flex"
                style={{ background: '#0D1117', border: '1px solid #1F2937', maxHeight: '90vh' }}>

                {/* Left: form */}
                <div className="flex-1 px-10 py-8 flex flex-col min-w-0 overflow-y-auto">
                    <h2 className="text-white font-bold text-2xl mb-6">
                        {mode === 'login' ? 'Avtorizatsiya' : "Ro'yxatdan o'tish"}
                    </h2>

                    {/* Tabs */}
                    <div className="flex rounded-xl bg-[#1A1D21] p-1 mb-5">
                        <button
                            onClick={() => { setTab('phone'); setError(''); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === 'phone' ? 'bg-[#2196F3] text-white' : 'text-[#8A8F98] hover:text-white'}`}
                        >
                            Telefon raqam orqali
                        </button>
                        <button
                            onClick={() => { setTab('email'); setError(''); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === 'email' ? 'bg-[#2196F3] text-white' : 'text-[#8A8F98] hover:text-white'}`}
                        >
                            Elektron pochta orqali
                        </button>
                    </div>

                    {/* LOGIN FORM */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            {tab === 'phone' ? (
                                <div>
                                    <label className="block text-sm mb-2 text-[#9CA3AF]">Telefon raqam</label>
                                    <div className={`flex items-center rounded-xl border bg-[#111827] transition-colors ${error ? 'border-red-500' : 'border-[#1F2937] focus-within:border-[#2196F3]'}`}>
                                        <span className="px-4 py-3.5 text-sm text-[#9CA3AF] border-r border-[#1F2937] select-none shrink-0">+998</span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={e => { setError(''); setPhone(e.target.value.replace(/\D/g, '').slice(0, 9)); }}
                                            placeholder="__ ___-__-__"
                                            autoFocus
                                            className="flex-1 bg-transparent text-sm px-3 py-3.5 outline-none placeholder:text-[#4B5563] text-white min-w-0"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm mb-2 text-[#9CA3AF]">Elektron pochta</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => { setError(''); setEmail(e.target.value); }}
                                        placeholder="example@gmail.com"
                                        autoFocus
                                        className={`w-full text-sm px-4 py-3.5 rounded-xl outline-none placeholder:text-[#4B5563] bg-[#111827] text-white border transition-colors ${error ? 'border-red-500' : 'border-[#1F2937] focus:border-[#2196F3]'}`}
                                    />
                                </div>
                            )}

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-[#9CA3AF]">Parol</label>
                                    <Link href="/auth/forgot-password" onClick={onClose} className="text-sm text-[#2196F3] hover:underline">
                                        Parolni unutdingizmi?
                                    </Link>
                                </div>
                                <div className={`flex items-center rounded-xl border bg-[#111827] transition-colors ${error ? 'border-red-500' : 'border-[#1F2937] focus-within:border-[#2196F3]'}`}>
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => { setError(''); setPassword(e.target.value); }}
                                        placeholder="Parolingizni kiriting"
                                        className="flex-1 bg-transparent text-sm px-4 py-3.5 outline-none placeholder:text-[#4B5563] text-white min-w-0"
                                    />
                                    <button type="button" onClick={() => setShowPwd(v => !v)} className="px-3 text-[#6B7280] hover:text-white transition-colors cursor-pointer shrink-0">
                                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-xs text-red-500">{error}</p>}

                            <button type="submit" disabled={loading}
                                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#2196F3] hover:bg-[#1976D2] text-white disabled:opacity-70 transition-colors cursor-pointer mt-1">
                                {loading ? 'Yuklanmoqda...' : 'Kirish'}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-[#1F2937]" />
                                <span className="text-xs text-[#4B5563]">yoki</span>
                                <div className="flex-1 h-px bg-[#1F2937]" />
                            </div>

                            <button type="button" onClick={() => { setMode('register'); setError(''); }}
                                className="w-full py-3.5 rounded-xl font-semibold text-sm text-center bg-[#1A1D21] text-white hover:bg-[#22262C] transition-colors border border-[#2A2D31] cursor-pointer">
                                Ro&apos;yxatdan o&apos;tish
                            </button>
                        </form>
                    )}

                    {/* REGISTER FORM */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm mb-2 text-[#9CA3AF]">Ism</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => { setError(''); setName(e.target.value); }}
                                    placeholder="Ismingizni kiriting"
                                    autoFocus
                                    className="w-full text-sm px-4 py-3.5 rounded-xl outline-none placeholder:text-[#4B5563] bg-[#111827] text-white border border-[#1F2937] focus:border-[#2196F3] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2 text-[#9CA3AF]">Telefon raqam</label>
                                <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#111827] focus-within:border-[#2196F3] transition-colors">
                                    <span className="px-4 py-3.5 text-sm text-[#9CA3AF] border-r border-[#1F2937] select-none shrink-0">+998</span>
                                    <input
                                        type="tel"
                                        value={regPhone}
                                        onChange={e => { setError(''); setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 9)); }}
                                        placeholder="__ ___-__-__"
                                        className="flex-1 bg-transparent text-sm px-3 py-3.5 outline-none placeholder:text-[#4B5563] text-white min-w-0"
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-[#8A8F98] leading-relaxed">
                                Ro&apos;yxatdan o&apos;tish tugmasini bosgach foydalanish{' '}
                                <Link href="/terms" onClick={onClose} className="text-[#2196F3] hover:underline">shartlari va qoidalarini</Link>
                                {' '}qabul qilaman
                            </p>

                            {error && <p className="text-xs text-red-500">{error}</p>}

                            <button type="submit" disabled={loading}
                                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#2196F3] hover:bg-[#1976D2] text-white disabled:opacity-70 transition-colors cursor-pointer">
                                {loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish"}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-[#1F2937]" />
                                <span className="text-xs text-[#4B5563]">yoki</span>
                                <div className="flex-1 h-px bg-[#1F2937]" />
                            </div>

                            <button type="button" onClick={() => { setMode('login'); setError(''); }}
                                className="w-full py-3.5 rounded-xl font-semibold text-sm text-center bg-[#1A1D21] text-white hover:bg-[#22262C] transition-colors border border-[#2A2D31] cursor-pointer">
                                Kirish
                            </button>
                        </form>
                    )}
                </div>

                {/* Right: preview + slogan */}
                <div className="w-[380px] hidden md:flex flex-col items-center justify-end overflow-hidden relative shrink-0"
                    style={{ background: 'linear-gradient(160deg, #0e1e35 0%, #0a1525 40%, #060A0F 100%)' }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 z-10">
                        <p className="text-white font-black text-4xl leading-tight text-center">Shaxmatni</p>
                        <p className="text-[#8A9BAD] text-lg font-medium tracking-wide text-center">biz bilan o&apos;rganing!</p>
                    </div>
                    <Image
                        src="/Frame 427318502.png"
                        alt="UzChess platform"
                        width={380}
                        height={500}
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
