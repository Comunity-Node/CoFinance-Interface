import Link from 'next/link';
import React from 'react';
import { Spotlight } from './ui/Spotlight';
import { Button } from './ui/moving-border';
import Image from 'next/image';

const HeroSection = () => {
    return (
        <div className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">
            <Spotlight
                className="-top-10 left-0 md:left-60 md:-top-50"
                fill="white"
            />
            <div className="p-4 relative z-10 w-full text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="mt-20"> 
                        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                            CoFinance
                        </h1>
                        <h2 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mt-2"> 
                            Next Gen DeFi Platform
                        </h2>
                    </div>
                </div>
                <p className="mt-8 font-normal text-base md:text-lg text-neutral-300 max-w-lg mx-auto">
                    Explore the future of decentralized finance with our cutting-edge platform. Our shared liquidity model enhances your blockchain journey, making it more engaging and efficient. Discover how we can help you optimize your financial strategies and achieve your goals with ease.
                </p>
                <div className="mt-4">
                    <Link href={"/swap"}>
                        <Button
                            borderRadius="1.75rem"
                            className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
                        >
                            Explore CoFinance
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
