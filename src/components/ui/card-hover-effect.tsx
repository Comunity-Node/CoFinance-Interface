import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
    items,
    className,
}: {
    items: {
        title: string;
        description: string;
        link: string;
        img: string;
    }[];
    className?: string;
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <Link
                    href={item?.link}
                    key={item?.link}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card isHovered={hoveredIndex === idx}>
                        <CardTitle img={item.img}>{item.title}</CardTitle>
                        {hoveredIndex === idx && <CardDescription>{item.description}</CardDescription>}
                    </Card>
                </Link>
            ))}
        </div>
    );
};

const Card = ({
    className,
    children,
    isHovered,
}: {
    className?: string;
    children: React.ReactNode;
    isHovered?: boolean;
}) => {
    return (
        <div
            className={cn(
                "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
                className,
                { 'bg-custom-linear-gradient': isHovered }
            )}
        >
            <div className="relative z-50">
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

const CardTitle = ({
    className,
    children,
    img,
}: {
    className?: string;
    children: React.ReactNode;
    img: string;
}) => {
    return (
        <div className="flex items-center">
            <img
                src={img}
                alt="Card Image"
                width={50}
                height={50}
                className="w-12 h-12 object-cover rounded-full mr-4"
            />
            <h4 className={cn("text-zinc-100 font-bold tracking-wide", className)}>
                {children}
            </h4>
        </div>
    );
};

const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className={cn(
                "mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm transition-opacity duration-300",
                className
            )}
        >
            {children}
        </p>
    );
};
