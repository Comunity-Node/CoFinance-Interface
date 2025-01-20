'use client';
import { url } from "inspector";
import { HoverEffect } from "./ui/card-hover-effect";

// Sample token data; replace with actual token data source
const featuredTokens = [
    {
        image: 'https://miro.medium.com/v2/resize:fit:256/1*jTN3cYGlobHuPdnhu2lYhg.png',
        name: 'Cross Finance',
        description: 'Explore the decentralized infrastructure of services built on CrossFi Chain’s own L1 blockchain, synthesizing the advantages of traditional financial instruments with the security and transparency of blockchain solutions.',
        slug: 'crossfi',
        isFeatured: true,
        url: 'https://crossfi.org/'
    },
    {
        image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/31525.png',
        name: 'Taiko',
        description: 'This is a Block Explorer and Analytics Platform for Taiko Mainnet.',
        slug: 'taiko',
        isFeatured: true,
        url: 'https://taikoscan.io/'
    },
    {
        image: 'https://fineproxy.org/wp-content/uploads/2023/08/Binance-Smart-Chain-logo-1-2048x2048.png',
        name: 'Binance Smart Chain',
        description: 'Harnessing Decentralization to Make the Impossible Possible',
        slug: 'binance',
        isFeatured: true,
        url: 'https://crossfi.org/'
    },
    {
        image: 'https://pbs.twimg.com/profile_images/1630871073917894659/LbAxXi_V_400x400.jpg',
        name: 'Swisstronik',
        description: 'Swisstronik is an identity-based hybrid blockchain ecosystem. It lets Web 3.0 and traditional companies build KYC, AML and DPR-compliant applications with enhanced data privacy.',
        slug: 'swisstronik',
        isFeatured: true,
        url: 'https://ind.swisstronik.com/'
    },
    {
        image: 'https://planq.network/_next/image?url=https%3A%2F%2Fcdn.builder.io%2Fapi%2Fv1%2Fimage%2Fassets%252F9770b285ecd94682a83d82643e538cdf%252F352051f7ea1344578a069ae40f99d9d1&w=256&q=75',
        name: 'Planq Network',
        description: 'Planq network opens up the full blockchain potential of your phone with easy accessibility.',
        slug: 'planq',
        isFeatured: true,
        url: 'https://planq.network/'
    },
    {
        image: 'https://s3.coinmarketcap.com/static-gravity/image/992744cfbd5e40f5920018ee7a830b98.png',
        name: 'Sei Network',
        description: 'Pushing the boundaries of blockchain technology through open source development, Sei stands to unlock a brand new design space for consumer facing applications.',
        slug: 'sei',
        isFeatured: true,
        url: 'https://www.sei.io/'
    },
];

function UpcomingTokens() {
    return (
        <section className="py-20 lg:px-0 px-4">
            <div className="relative max-w-7xl mx-auto" data-aos="fade-up">
                <div className="text-center">
                    <p className='text-gray-600 text-xl uppercase'>Supports</p>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Our Suported Networks</p>
                </div>
                <div className="mt-10">
                    <HoverEffect
                        items={featuredTokens.map(token => (
                            {
                                title: token.name,
                                img: token.image,
                                description: token.description,
                                link: `${token.url}`,
                                className: "bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg border border-gray-700 rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
                            }
                        ))}
                    />
                </div>
            </div>
        </section>
    );
}

export default UpcomingTokens;
