'use client';
import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import styles from '@/styles/slider.module.css';
import Link from "next/link";



function PromotionBanner() {

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
    return (
        <section className="p-10">
            <div className="flex items-center justify-center space-x-10">
                <div className="relative max-w-2xl text-start">
                    <p className="text-4xl font-bold leading-relaxed">
                        Discover Top News On the Blockchain Space
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="relative overflow-hidden h-auto bg-transparent rounded-2xl p-5 max-w-screen-xl [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                        <div className="flex items-center space-x-6 animate-bannermove max-w-max" >
                            {promotions.map((promotion, index) => (
                                <Link href={promotion.link} key={index}>
                                    <div className="card glass image-full w-96 h-72 shadow-xl">
                                        <figure className="h-full w-full">
                                            <img
                                                src={promotion.image}
                                                alt={promotion.altText}
                                                className="w-full h-full object-cover"
                                            />
                                        </figure>
                                        <div className="card-body top-40">
                                            <div className="flex items-start justify-end">
                                                <p className="text-sm">{promotion.altText}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </section >
    );
}

export default PromotionBanner;
