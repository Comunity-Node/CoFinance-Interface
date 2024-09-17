import Link from 'next/link';
import React from 'react';
import { Spotlight } from './ui/Spotlight';
import { Button } from './ui/moving-border';
import { FaChevronRight } from 'react-icons/fa';

const HeroSection = () => {
    return (
        <section className="min-h-screen w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">
            <Spotlight
                className="-top-10 left-0 md:left-60 md:-top-50"
                fill="white"
            />
            <div className="hero bg-transparent min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src="./img-hero.svg"
                        className="max-w-sm rounded-lg animate-pulse " />
                    <div>
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">CoFinance - Next Gen DeFi Platform</h1>
                        <p className="py-6 text-gray-400">
                            Explore the future of decentralized finance with our cutting-edge platform. Our shared liquidity model enhances your blockchain journey, making it more engaging and efficient. Discover how we can help you optimize your financial strategies and achieve your goals with ease.
                        </p>
                        <Link href={"/swap"}>
                            <Button
                                borderRadius="1.75rem"
                                className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 space-x-2"
                            >
                                Explore Now <FaChevronRight className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
