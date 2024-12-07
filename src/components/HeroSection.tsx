import Link from 'next/link';
import React from 'react';
import { Button } from './ui/moving-border';
import { FaChevronRight } from 'react-icons/fa';
import NetworkAnimation from './animated/NetworkAnimation';

const HeroSection = () => {
    return (
        <section className="min-h-screen min-w-screen-lg rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0 bg-blur-hero bg-cover">
            <div className="hero bg-transparent min-h-screen z-10">
                <NetworkAnimation />
                <div className="hero-content flex-col lg:flex-row-reverse" data-aos="fade-up">
                    <div className='text-center space-y-4 max-w-2xl'>
                        <p className='lg:text-gray-600 text-gray-500 text-xl uppercase'>CoFinance</p>
                        <h1 className="lg:text-7xl text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-700">Next Gen DeFi Platform</h1>
                        <p className="py-6 text-gray-500 lg:text-xl text-sm">
                            Explore the future of decentralized finance with our cutting-edge platform.
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
