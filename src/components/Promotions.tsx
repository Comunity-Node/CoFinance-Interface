'use client';
import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const promotions = [
    {
        image: '/Promotions/promo.png',
        altText: '🔥 Swisstronik Has Launched Testnet 2 with Incentivized Rewards!!!',
        link: 'https://www.swisstronik.com/testnet2/dashboard',
    },
    {
        image: '/Promotions/promo.png',
        altText: '🔥 PLanq Integrated and Physica Launch',
        link: 'https://physica.finance',
    },
    {
        image: '/Promotions/promo.png',
        altText: '🔥 Staking to Our validator',
        link: 'https://comunitynode.my.id',
    },
    {
        image: '/Promotions/promo.png',
        altText: '🔥 Oraichain has Sucefully smooth Update on new version',
        link: 'https://oraichain.io',
    },
    {
        image: '/Promotions/promo.png',
        altText: '🔥 Integration and development o swisstronik blockchain',
        link: 'https://example.com/token-e',
    },
];


function PromotionBanner() {
    return (
        <div className="relative py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md z-[-1]"></div>
            <div className="relative max-w-7xl mx-auto text-center">
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 sm:text-4xl bg-glassy backdrop-filter backdrop-blur-md p-4 rounded-lg">
                    Discover Top News On the Blockchain Space
                </p>
            </div>
            <div className="mt-10">
                <div className="flex overflow-x-auto">
                    <InfiniteMovingCards
                        items={promotions}
                        direction="right"
                        speed="slow"
                        pauseOnHover={true}
                        renderItem={({ image, altText, link }) => (
                            <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-4 bg-glassy backdrop-filter backdrop-blur-md rounded-lg shadow-lg mx-2 animate-border-pulse border-2 border-transparent"
                            >
                                <img
                                    src={image}
                                    alt={altText}
                                    className="object-cover w-full h-36 rounded-lg mb-2"
                                />
                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                    {altText}
                                </p>
                            </a>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default PromotionBanner;
