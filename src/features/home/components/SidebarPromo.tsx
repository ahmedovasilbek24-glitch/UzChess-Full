import Image from 'next/image';
import Link from 'next/link';

/* Hand holding chess pieces (king + rook) icon – matches Figma "Qo'llab quvvatlash" */
function SupportIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 24 Q8 30 14 32 L26 32 Q32 32 32 26 L32 18 Q32 16 30 16 Q29 16 28 17 L28 14 Q28 12 26 12 Q25 12 24 13 L24 12 Q24 10 22 10 Q20 10 20 12 L20 22 L18 20 Q16 18 14 19 Q12 20 13 22 Z" fill="#2196F3" />
            <rect x="16" y="3" width="3" height="6" rx="1" fill="#2196F3" />
            <rect x="14" y="5" width="7" height="2" rx="1" fill="#2196F3" />
            <rect x="15" y="7" width="5" height="4" rx="1" fill="#2196F3" />
            <rect x="23" y="4" width="6" height="2" rx="0.5" fill="#2196F3" />
            <rect x="24" y="6" width="4" height="5" rx="1" fill="#2196F3" />
            <rect x="23" y="11" width="6" height="1.5" rx="0.5" fill="#2196F3" />
        </svg>
    );
}

function StoreIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="28" height="7" rx="2" fill="#2196F3" />
            <rect x="9" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
            <rect x="14" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
            <rect x="19" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
            <rect x="24" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
            <rect x="29" y="8" width="2" height="7" fill="#1565C0" opacity="0.5" />
            <rect x="7" y="16" width="26" height="18" rx="1" fill="#2196F3" />
            <rect x="16" y="24" width="8" height="10" rx="1" fill="#1565C0" />
            <rect x="9" y="19" width="6" height="5" rx="1" fill="#1565C0" />
            <rect x="25" y="19" width="6" height="5" rx="1" fill="#1565C0" />
        </svg>
    );
}

const PROMO_CARDS = [
    {
        Icon: SupportIcon,
        title: "Qo'llab quvvatlash",
        sub: "Shaxmat rivojiga hissa qo'shing",
        href: '#',
    },
    {
        Icon: StoreIcon,
        title: "Suvenirlar",
        sub: "Tematik maxsulotlar magazini",
        href: '#',
    },
];

export default function SidebarPromo() {
    return (
        <>
            {PROMO_CARDS.map(({ Icon, title, sub, href }) => (
                <Link
                    key={title}
                    href={href}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#2196F3]/50 transition-colors flex-shrink-0"
                >
                    <div className="flex-shrink-0">
                        <Icon />
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-[15px] font-semibold leading-tight">{title}</p>
                        <p className="text-[#6B7280] text-[12px] mt-0.5 leading-tight">{sub}</p>
                    </div>
                </Link>
            ))}

            <div className="w-full rounded-2xl overflow-hidden flex-shrink-0">
                <Image
                    src="/Banners.png"
                    alt="Yoshlar portali"
                    width={265}
                    height={150}
                    className="w-full h-auto block"
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
        </>
    );
}
