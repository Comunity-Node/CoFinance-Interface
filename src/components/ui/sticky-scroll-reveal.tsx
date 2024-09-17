'use client';
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";

export const StickyScroll = ({
    content,
}: {
    content: {
        title: string;
        description: string;
        image: string;
    }[];
}) => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end start"],
    });
    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        console.log("Breakpoints:", cardsBreakpoints); // Debug: Check breakpoints

        cardsBreakpoints.forEach((breakpoint, index) => {
            if (latest > breakpoint - 0.2 && latest <= breakpoint) {
                setActiveCard(index);
            }
        });
    });

    const backgroundColors = [
        "var(--black-100)", // Inactive color
        "var(--black)",     // Active color
    ];

    return (
        <motion.div
            animate={{
                backgroundColor: backgroundColors[1], // Active color
            }}
            className="h-screen overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10"
            ref={ref}
        >
            <div className="flex flex-col items-center justify-center px-4 w-full lg:w-1/2">
                {content.map((item, index) => (
                    <div
                        key={item.title + index}
                        className={`w-full min-h-screen flex flex-col justify-center space-y-10 ${activeCard === index ? 'bg-black' : 'bg-transparent'}`}
                    >
                        <motion.h2
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: activeCard === index ? 1 : 0.3,
                            }}
                            className="text-4xl font-bold text-slate-100"
                        >
                            {item.title}
                        </motion.h2>
                        <motion.p
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: activeCard === index ? 1 : 0.3,
                            }}
                            className="text-lg text-slate-300 mt-4 max-w-sm"
                        >
                            {item.description}
                        </motion.p>
                    </div>
                ))}
            </div>
            <motion.div
                animate={{
                    backgroundImage: `url(${content[activeCard % cardLength].image})`,
                    backgroundSize: 'cover', // Fit the image
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
                className="my-auto items-center hidden lg:block lg:w-1/2 h-96 sticky top-10 rounded-lg overflow-hidden shadow-lg"
            ></motion.div>
        </motion.div>
    );
};
