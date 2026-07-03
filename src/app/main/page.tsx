"use client"
import ChessBanner from "@/app/main/component/ChessBanner";
import Footer from "@/features/shared/components/Footer/Footer";
import Header from "@/features/shared/components/Header/Header";
import NewsItemsMain from "@/app/main/component/NewsItemsMain";
import EndGames from "@/app/main/component/EndGames";
import QuickCarts from "@/app/main/component/QuickCarts";
import Rating from "@/app/main/component/Rating";
import DailyGame from "@/features/home/components/DailyGame";
import TopCourses from "@/app/main/component/TopCourses";
import TopBooks from "@/app/main/component/TopBooks";
import SidebarPromo from "@/features/home/components/SidebarPromo";

export default function Page() {
    return (
        <>
            <Header />
            <div className="mx-auto flex max-w-[1680px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
                    <div className="flex flex-col gap-5">
                        <Rating />
                        <DailyGame />
                    </div>

                    <div className="flex min-w-0 flex-col gap-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <QuickCarts
                                label="O'rganish"
                                iconGlowSrc="/cap-icon-glow.svg"
                                watermarkSrc="/cap-watermark.svg"
                                watermarkWidth={272}
                                watermarkHeight={164}
                                watermarkTop={-26}
                                watermarkLeft={204}
                            />
                            <QuickCarts
                                label="Kutubxona"
                                iconGlowSrc="/books-icon-glow.svg"
                                watermarkSrc="/books-watermark.svg"
                                watermarkWidth={171}
                                watermarkHeight={152}
                                watermarkTop={2}
                                watermarkLeft={212}
                            />
                        </div>
                        <EndGames />
                        <ChessBanner />
                        <NewsItemsMain />
                    </div>

                    <div className="flex flex-col gap-5">
                        <SidebarPromo />
                        <TopCourses />
                        <TopBooks />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
