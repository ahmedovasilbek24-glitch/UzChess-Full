import Link from 'next/link';

function GraduationCapIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L30 11L16 18L2 11L16 4Z" fill="#2ea6ff"/>
            <path d="M7 14.5V21.5C7 21.5 10.5 26 16 26C21.5 26 25 21.5 25 21.5V14.5" stroke="#2ea6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="30" cy="11" r="1.5" fill="#2ea6ff"/>
            <line x1="30" y1="12.5" x2="30" y2="19" stroke="#2ea6ff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

function LibraryIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="5" width="6" height="22" rx="1.5" fill="#2ea6ff"/>
            <rect x="11" y="5" width="6" height="22" rx="1.5" fill="#2ea6ff" opacity="0.8"/>
            <rect x="19" y="5" width="10" height="22" rx="1.5" fill="#2ea6ff" opacity="0.6"/>
            <line x1="20" y1="9" x2="28" y2="9" stroke="#0b1015" strokeWidth="1.2"/>
            <line x1="20" y1="13" x2="28" y2="13" stroke="#0b1015" strokeWidth="1.2"/>
        </svg>
    );
}

const BANNERS = [
    {href: '/courses', label: 'Kurslar', Icon: GraduationCapIcon},
    {href: '/library', label: 'Kutubxona', Icon: LibraryIcon},
];

export default function CourseBanners() {
    return (
        <div className="grid flex-shrink-0 grid-cols-1 gap-4 md:grid-cols-2">
            {BANNERS.map(({href, label, Icon}) => (
                <Link
                    key={href}
                    href={href}
                    className="group flex items-center justify-center gap-3 rounded-[20px] border border-[#1f2730] bg-[radial-gradient(circle_at_top_left,_rgba(46,166,255,0.16),_transparent_55%),linear-gradient(135deg,_#0d1115,_#121820)] px-4 py-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2ea6ff]/60"
                >
                    <Icon />
                    <span className="text-[15px] font-semibold text-white">{label}</span>
                </Link>
            ))}
        </div>
    );
}
