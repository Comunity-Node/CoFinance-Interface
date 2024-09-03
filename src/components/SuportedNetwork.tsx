'use client';
import { HoverEffect } from "./ui/card-hover-effect";  

// Sample token data; replace with actual token data source
const featuredTokens = [
    {
        name: 'Ethereum',
        description: 'A decentralized platform that enables smart contracts and decentralized applications (dApps) to be built and run without any downtime, fraud, control, or interference from a third party.',
        slug: 'ethereum',
        isFeatured: true,
    },
    {
        name: 'Cardano',
        description: 'A blockchain platform for smart contracts, aiming to provide a more secure and scalable infrastructure for decentralized applications and crypto-assets.',
        slug: 'cardano',
        isFeatured: true,
    },
    {
        name: 'Swisstronik',
        description: 'An innovative blockchain project focusing on scalable smart contract deployment and integration with EVM-compatible chains.',
        slug: 'swisstronik',
        isFeatured: true,
    },
    {
        name: 'Planq',
        description: 'A decentralized network focused on secure and scalable cross-chain interactions and decentralized finance applications.',
        slug: 'planq',
        isFeatured: true,
    },
    {
        name: 'Solana',
        description: 'A high-performance blockchain supporting decentralized applications and crypto-currencies with high throughput and low transaction costs.',
        slug: 'solana',
        isFeatured: true,
    },
    {
        name: 'Avalanche',
        description: 'A platform for building and deploying decentralized applications and custom blockchain networks, aiming for high scalability and low latency.',
        slug: 'avalanche',
        isFeatured: true,
    },
    {
        name: 'Tezos',
        description: 'A self-amending blockchain that provides a secure and scalable infrastructure for smart contracts and decentralized applications.',
        slug: 'tezos',
        isFeatured: true,
    },
];

function UpcomingTokens() {
    return (
        <div className="relative py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md z-[-1]"></div>
            <div className="relative max-w-7xl mx-auto">
                <div className="text-center">
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Our Suported Network</p>
                </div>

                <div className="mt-10">
                    <HoverEffect
                        items={featuredTokens.map(token => (
                            {
                                title: token.name,
                                description: token.description,
                                link: `/tokens/${token.slug}`,
                                className: "bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg border border-gray-700 rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
                            }
                        ))}
                    />
                </div>
            </div>
        </div>
    );
}

export default UpcomingTokens;
