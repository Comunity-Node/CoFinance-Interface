"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";

const defiServiceContent = [
  {
      title: 'Innovative DeFi Solutions for Your Financial Freedom',
      description:
          'Explore cutting-edge decentralized financial services that empower you to take control of your assets. Our DeFi solutions provide transparency, security, and flexibility, allowing you to manage your finances with confidence and ease.',
      image: '/component/stats.png', 
  },
  {
      title: 'Seamless Integration with Major Blockchains',
      description:
          'Our platform integrates smoothly with leading blockchains, ensuring broad compatibility and ease of use. Whether you’re working with Ethereum, Binance Smart Chain, or other major networks, our DeFi service offers a unified experience across various ecosystems.',
      image: '/component/block.png', // Add image path
  },
  {
      title: 'Real-Time Analytics and Insights',
      description:
          'Stay ahead with real-time data and analytics on your investments and transactions. Our platform offers advanced tools and insights, helping you make informed decisions and optimize your financial strategies.',
      image: '/component/realtime.png', // Add image path
  },
  {
      title: 'Security and Transparency at Every Step',
      description:
          'We prioritize your security with robust protocols and transparent processes. Our DeFi solutions are built on trustless smart contracts, ensuring that your assets are safe and transactions are verifiable.',
      image: '/component/safe.png', // Add image path
  },
  {
      title: 'Diverse Financial Products and Services',
      description:
          'From yield farming and staking to lending and borrowing, our platform offers a wide range of DeFi products. Explore new ways to grow your assets and participate in the decentralized financial revolution.',
      image: '/component/diversity.png', // Add image path
  },
];


function WhyChooseUs() {
  return (
    <div>
        <StickyScroll content={defiServiceContent} />
    </div>
  );
}

export default WhyChooseUs;
