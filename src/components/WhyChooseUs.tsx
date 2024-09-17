"use client";
import React from "react";

const defiServiceContent = [
    {
        title: 'Seamless Integration with Major Blockchains',
        description:
            'Our platform integrates smoothly with leading blockchains, ensuring broad compatibility and ease of use. Whether you’re working with Ethereum, Binance Smart Chain, or other major networks, our DeFi service offers a unified experience across various ecosystems.',
        image: '/block-bg.svg', // Add image path
    },
    {
        title: 'Real-Time Analytics and Insights',
        description:
            'Stay ahead with real-time data and analytics on your investments and transactions. Our platform offers advanced tools and insights, helping you make informed decisions and optimize your financial strategies.',
        image: '/analitycs-bg.svg', // Add image path
    },
    {
        title: 'Security and Transparency at Every Step',
        description:
            'We prioritize your security with robust protocols and transparent processes. Our DeFi solutions are built on trustless smart contracts, ensuring that your assets are safe and transactions are verifiable.',
        image: '/shield-bg.svg', // Add image path
    },
    {
        title: 'Diverse Financial Products and Services',
        description:
            'From yield farming and staking to lending and borrowing, our platform offers a wide range of DeFi products. Explore new ways to grow your assets and participate in the decentralized financial revolution.',
        image: '/finance-bg.svg', // Add image path
    },
];


function WhyChooseUs() {
    return (
        <section className="p-10 bg-custom-radial-gradient">
            <div className="text-center">
                <p className="text-5xl font-extrabold ">Why Choose Us</p>
            </div>
            <div className="py-10 px-40">
                <div className="grid grid-cols-2 gap-4 space-y-4">
                    <div className="col-span-2">
                        <div className="card card-side bg-custom-linear-gradient shadow-xl p-5 h-56">
                            <figure className="w-48 h-48">
                                <img
                                    src="/stats-bg.svg"
                                    alt="Stats" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-2xl font-semibold">Innovative DeFi Solutions for Your Financial Freedom</h2>
                                <p className="font-medium text-gray-400 text-sm">Explore cutting-edge decentralized financial services that empower you to take control of your assets. Our DeFi solutions provide transparency, security, and flexibility, allowing you to manage your finances with confidence and ease.</p>
                            </div>
                        </div>
                    </div>
                    {defiServiceContent.map((item, index) => (
                        <div key={index}>
                            <div className="card card-side bg-custom-linear-gradient shadow-xl p-5 h-56">
                                <figure className="w-full h-auto">
                                    <img
                                        src={item.image}
                                        alt={item.title} />
                                </figure>
                                <div className="card-body text-2xl font-semibold">
                                    <h2 className="card-title">{item.title}</h2>
                                    <p className="font-medium text-gray-400 text-sm">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
