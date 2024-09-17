'use client';
import { HoverEffect } from "./ui/card-hover-effect";

// Sample token data; replace with actual token data source
const featuredTokens = [
    {
        image: 'https://www.logo.wine/a/logo/Ethereum/Ethereum-Logo.wine.svg',
        name: 'Ethereum',
        description: 'A decentralized platform that enables smart contracts and decentralized applications (dApps) to be built and run without any downtime, fraud, control, or interference from a third party.',
        slug: 'ethereum',
        isFeatured: true,
    },
    {
        image: 'https://global.discourse-cdn.com/standard11/uploads/scroll2/original/2X/3/3bc70fd653f9c50abbb41b7568e549535f768fcc.png',
        name: 'Scroll',
        description: 'A blockchain platform for smart contracts, aiming to provide a more secure and scalable infrastructure for decentralized applications and crypto-assets.',
        slug: 'scroll',
        isFeatured: true,
    },
    {
        image: 'https://s3-ap-southeast-2.amazonaws.com/www.cryptoknowmics.com/airdrops/SWTR_LOGO_SYMBOL_PNG.png',
        name: 'Swisstronik',
        description: 'An innovative blockchain project focusing on scalable smart contract deployment and integration with EVM-compatible chains.',
        slug: 'swisstronik',
        isFeatured: true,
    },
    {
        image: 'https://evm.planq.network/og-image.png',
        name: 'Planq Network',
        description: 'A decentralized network focused on secure and scalable cross-chain interactions and decentralized finance applications.',
        slug: 'planq',
        isFeatured: true,
    },
    {
        image: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.webp',
        name: 'Base',
        description: 'A high-performance blockchain supporting decentralized applications and crypto-currencies with high throughput and low transaction costs.',
        slug: 'base',
        isFeatured: true,
    },
    {
        image: 'https://images.prismic.io/uphold/3f0371cb-ed69-4a01-84cb-8b9c2a814421_ORAI%402x.png?auto=compress,format',
        name: 'Orichain',
        description: 'A platform for building and deploying decentralized applications and custom blockchain networks, aiming for high scalability and low latency.',
        slug: 'orichain',
        isFeatured: true,
    },
    {
        image: 'https://i0.wp.com/www.followchain.org/wp-content/uploads/2024/03/icons8-bnb-330.png?fit=330%2C330&ssl=1',
        name: 'Binance Smart Chain',
        description: 'A self-amending blockchain that provides a secure and scalable infrastructure for smart contracts and decentralized applications.',
        slug: 'bsc',
        isFeatured: true,
    },
    {
        image: 'https://miro.medium.com/v2/resize:fit:256/1*jTN3cYGlobHuPdnhu2lYhg.png',
        name: 'Cross Finance',
        description: 'A self-amending blockchain that provides a secure and scalable infrastructure for smart contracts and decentralized applications.',
        slug: 'cross-finance',
        isFeatured: true,
    },
    {
        image: 'https://cdn-icons-png.freepik.com/512/12114/12114233.png',
        name: 'Polygon',
        description: 'A self-amending blockchain that provides a secure and scalable infrastructure for smart contracts and decentralized applications.',
        slug: 'polygon',
        isFeatured: true,
    },
];

function UpcomingTokens() {
    return (
        <section className="py-10">
            <div className="relative max-w-7xl mx-auto">
                <div className="text-center">
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Our Suported Network</p>
                </div>

                <div className="mt-10">
                    <HoverEffect
                        items={featuredTokens.map(token => (
                            {
                                title: token.name,
                                img: token.image,
                                description: token.description,
                                link: `/tokens/${token.slug}`,
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
