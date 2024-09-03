"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    renderItem,
    className,
}: {
    items: any[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    renderItem: (item: any) => React.ReactNode;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);

    const [start, setStart] = useState(false);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }

    const getDirection = () => {
        if (containerRef.current) {
            containerRef.current.style.setProperty(
                "--animation-direction",
                direction === "left" ? "forwards" : "reverse"
            );
        }
    };

    const getSpeed = () => {
        if (containerRef.current) {
            let duration;
            switch (speed) {
                case "fast":
                    duration = "20s";
                    break;
                case "normal":
                    duration = "40s";
                    break;
                case "slow":
                    duration = "80s";
                    break;
                default:
                    duration = "40s";
            }
            containerRef.current.style.setProperty("--animation-duration", duration);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-2 py-2 w-max flex-nowrap",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        key={idx}
                        className="w-[250px] max-w-full relative rounded-2xl flex-shrink-0 px-6 py-4 md:w-[350px] bg-glassy backdrop-filter backdrop-blur-md"
                    >
                        {renderItem(item)}
                    </li>
                ))}
            </ul>
        </div>
    );
};