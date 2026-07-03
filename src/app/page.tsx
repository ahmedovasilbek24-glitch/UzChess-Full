'use client';

import {useEffect, useState} from 'react';
import api from '@/lib/api';

import DailyGame from '@/features/home/components/DailyGame';
import PlayerRating, {Player} from '@/features/home/components/PlayerRating';
import CourseBanners from '@/features/home/components/CourseBanners';
import UpcomingGames, {Game} from '@/features/home/components/UpcomingGames';
import ChessComBanner from '@/features/home/components/ChessComBanner';
import NewsList, {NewsItem} from '@/features/home/components/NewsList';
import SidebarPromo from '@/features/home/components/SidebarPromo';
import TopCourses, {Course} from '@/features/home/components/TopCourses';
import TopBooks, {Book} from '@/features/home/components/TopBooks';

const STATIC_PLAYERS: Player[] = [
    {id: 1, fullName: 'Magnus Carlsen', rating: 2861, positionChange: 12, ratingChange: 102},
    {id: 2, fullName: 'Nikaru Hakamura', rating: 2850, positionChange: -12, ratingChange: -11},
    {id: 3, fullName: 'Abdusattorov Nodirbek', rating: 2842, positionChange: 27, ratingChange: 18},
    {id: 4, fullName: 'Sindarov Javokhir', rating: 2839, positionChange: 0, ratingChange: 41},
    {id: 5, fullName: 'Yaqubboev Nodirbek', rating: 2839, positionChange: 5, ratingChange: 19},
];

const STATIC_GAMES: Game[] = [
    {
        id: 101,
        p1: 'Shohrukh Bakhtiyarov',
        p1Rating: 2861,
        p2: 'Nikaru Hakamura',
        p2Rating: 2768,
        result: '2-0',
        type: 'Rapid',
        moves: 56,
        date: '12 Dekabr'
    },
    {
        id: 102,
        p1: 'Abdusattorov Nodirbek',
        p1Rating: 2604,
        p2: 'Ding Liren',
        p2Rating: 2312,
        result: '1-0',
        type: 'Bullet',
        moves: 20,
        date: '21 Noyabr'
    },
    {
        id: 103,
        p1: 'Aronian Levon',
        p1Rating: 2402,
        p2: 'Sindarov Javokhir',
        p2Rating: 2641,
        result: '0-2',
        type: 'Blitz',
        moves: 19,
        date: '19 Oktabr'
    },
    {
        id: 104,
        p1: 'Caruana Fabiano',
        p1Rating: 2402,
        p2: 'Rapport Richard',
        p2Rating: 2641,
        result: '1-1',
        type: 'Blitz',
        moves: 56,
        date: '2 Sentabr'
    },
    {
        id: 105,
        p1: 'Yakubboev Nodirbek',
        p1Rating: 2402,
        p2: 'Gelfand Boris',
        p2Rating: 2641,
        result: '4-1',
        type: 'Bullet',
        moves: 56,
        date: '2 Sentabr'
    },
];

const UZ_MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
function fmtDate(raw: string) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]}`;
}

export default function HomePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [players, setPlayers] = useState<Player[]>(STATIC_PLAYERS);
    const [games, setGames] = useState<Game[]>(STATIC_GAMES);
    const [loading, setLoading] = useState(true);
    const [newsVisible, setNewsVisible] = useState(4);

    useEffect(() => {
        (async () => {
            try {
                const [cRes, nRes, bRes] = await Promise.all([
                    api.get('/public/courses').catch(() => ({data: []})),
                    api.get('/public/news').catch(() => ({data: []})),
                    api.get('/public/book').catch(() => ({data: []})),
                ]);
                setCourses(Array.isArray(cRes.data?.data) ? cRes.data.data : Array.isArray(cRes.data) ? cRes.data : []);
                setNews(Array.isArray(nRes.data?.data) ? nRes.data.data : Array.isArray(nRes.data) ? nRes.data : []);
                setBooks(Array.isArray(bRes.data?.data) ? bRes.data.data : Array.isArray(bRes.data) ? bRes.data : []);
                try {
                    const pRes = await api.get('/public/player');
                    const pd = Array.isArray(pRes.data?.data) ? pRes.data.data : Array.isArray(pRes.data) ? pRes.data : [];
                    if (pd.length > 0) setPlayers(pd);
                } catch { /* static fallback */ }
                try {
                    const gRes = await api.get('/public/games');
                    const gd: Record<string, unknown>[] = Array.isArray(gRes.data?.data) ? gRes.data.data : Array.isArray(gRes.data) ? gRes.data : [];
                    if (gd.length > 0) {
                        setGames(gd.slice(0, 5).map((g, i) => ({
                            id: (g.id as number) ?? i,
                            p1: String(g.p1 ?? g.player1 ?? g.white ?? ''),
                            p1Rating: Number(g.p1Rating ?? g.rating1 ?? g.whiteRating ?? 0) || undefined,
                            p2: String(g.p2 ?? g.player2 ?? g.black ?? ''),
                            p2Rating: Number(g.p2Rating ?? g.rating2 ?? g.blackRating ?? 0) || undefined,
                            result: String(g.result ?? g.score ?? '1-0'),
                            type: String(g.type ?? g.gameType ?? 'Rapid'),
                            moves: Number(g.moves ?? g.movesCount ?? 0),
                            date: String(g.date ?? (g.createdAt ? fmtDate(String(g.createdAt)) : '')),
                        })));
                    }
                } catch { /* static fallback */ }
            } catch (err) {
                console.error('Home fetch error:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-transparent">
            <div className="mx-auto flex max-w-[1680px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
                    <aside className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
                        <PlayerRating players={players} loading={loading} />
                        <DailyGame />
                    </aside>

                    <div className="flex min-w-0 flex-col gap-5">
                        <CourseBanners />
                        <UpcomingGames games={games} />
                        <ChessComBanner />
                        <NewsList
                            news={news}
                            loading={loading}
                            visible={newsVisible}
                            onLoadMore={() => setNewsVisible((v) => v + 4)}
                        />
                    </div>

                    <aside className="flex flex-col gap-5">
                        <SidebarPromo />
                        <TopCourses courses={courses} loading={loading} />
                        <TopBooks books={books} loading={loading} />
                    </aside>
                </div>
            </div>
        </div>
    );
}