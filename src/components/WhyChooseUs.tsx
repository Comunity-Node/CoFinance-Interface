"use client";
import React from "react";
import { MdOutlineArrowOutward } from "react-icons/md";

const defiServiceContent = [
    {
        title: 'Innovative DeFi Solutions',
        description:
            'Explore cutting-edge decentralized financial services that empower you to take control of your assets. Our DeFi solutions provide transparency, security, and flexibility, allowing you to manage your finances with confidence and ease.',
        image: '/stats-bg.svg', // Add image path
    },
    {
        title: 'Seamless Integration with Major Blockchains',
        description:
            'Our platform integrates smoothly with leading blockchains, ensuring broad compatibility and ease of use. Whether you’re working with Ethereum, Binance Smart Chain, or other major networks, our DeFi service offers a unified experience across various ecosystems.',
        image: '/block-bg.svg', // Add image path
    },
    {
        title: 'Real-Time Analytics & Insights',
        description:
            'Stay ahead with real-time data and analytics on your investments and transactions. Our platform offers advanced tools and insights, helping you make informed decisions and optimize your financial strategies.',
        image: '/analitycs-bg.svg', // Add image path
    },
    {
        title: 'Security and Transparency',
        description:
            'We prioritize your security with robust protocols and transparent processes. Our DeFi solutions are built on trustless smart contracts, ensuring that your assets are safe and transactions are verifiable.',
        image: '/shield-bg.svg', // Add image path
    },
    {
        title: 'Diverse Financial Products & Services',
        description:
            'From yield farming and staking to lending and borrowing, our platform offers a wide range of DeFi products. Explore new ways to grow your assets and participate in the decentralized financial revolution.',
        image: '/finance-bg.svg', // Add image path
    },
];


function WhyChooseUs() {
    return (
        <section className="p-0">
            <div className="flex items-center justify-center w-screen space-x-10 bg-choose-us bg-contain bg-no-repeat">
                <div className="max-w-2xl text-start space-y-4 px-5" data-aos="fade-right">
                    <p className="text-5xl font-extrabold">Be Part of the Open
                        Economy of the Future.</p>
                    <p className="text-md font-normal ps-1 text-gray-200">Lorem ipsum sit dolor amet.</p>
                    <button className="btn bg-transparent border-none hover:bg-transparent ps-1 hover:text-gray-200 text-2xl font-normal px-0 py-2 text-white shadow-none">Learn<MdOutlineArrowOutward /></button>
                </div>
                <div className="py-10 px-40 max-w-6xl">
                    <div className="space-y-4" data-aos="fade-up">
                        {defiServiceContent.map((item, index) => (
                            <div key={index}>
                                <div className="card card-side bg-transparent shadow-xl p-3 h-full">
                                    <div className="card-body text-2xl font-semibold">
                                        <h2 className="card-title text-3xl">{item.title}<MdOutlineArrowOutward /></h2>
                                        <p className="font-light text-gray-300 text-sm">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
