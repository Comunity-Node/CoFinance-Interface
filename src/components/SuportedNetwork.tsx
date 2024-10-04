'use client';
import { HoverEffect } from "./ui/card-hover-effect";

// Sample token data; replace with actual token data source
const featuredTokens = [
    {
        image: 'https://global.discourse-cdn.com/standard11/uploads/scroll2/original/2X/3/3bc70fd653f9c50abbb41b7568e549535f768fcc.png',
        name: 'Scroll',
        description: 'Scroll is compatible with Ethereum at the bytecode-level, meaning everything works right out of the box.',
        slug: 'scroll',
        isFeatured: true,
    },
    {
        image: 'https://seeklogo.com/images/M/manta-network-manta-logo-D595CAF1F9-seeklogo.com.png',
        name: 'Manta Network',
        description: 'Manta Network is building a secure and interoperable future with Zero-Knowledge. Our mission is to deliver the best developer experience that enables ZK applications.',
        slug: 'manta',
        isFeatured: true,
    },
];

function UpcomingTokens() {
    return (
        <section className="py-20">
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
