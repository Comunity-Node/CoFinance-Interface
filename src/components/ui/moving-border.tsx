"use client";
import React, { useRef } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";

// MovingBorder component reused from Button's effect
export const MovingBorder = ({
    children,
    duration = 2000,
    rx,
    ry,
    ...otherProps
}: {
    children: React.ReactNode;
    duration?: number;
    rx?: string;
    ry?: string;
    [key: string]: any;
}) => {
    const pathRef = useRef<any>();
    const progress = useMotionValue<number>(0);

    useAnimationFrame((time) => {
        const length = pathRef.current?.getTotalLength();
        if (length) {
            const pxPerMillisecond = length / duration;
            progress.set((time * pxPerMillisecond) % length);
        }
    });

    const x = useTransform(
        progress,
        (val) => pathRef.current?.getPointAtLength(val).x
    );
    const y = useTransform(
        progress,
        (val) => pathRef.current?.getPointAtLength(val).y
    );

    const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute h-full w-full"
                width="100%"
                height="100%"
                {...otherProps}
            >
                <rect
                    fill="none"
                    width="100%"
                    height="100%"
                    rx={rx}
                    ry={ry}
                    ref={pathRef}
                />
            </svg>
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform,
                }}
            >
                {children}
            </motion.div>
        </>
    );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    borderRadius?: string;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
}

export function Button({
    borderRadius = "1.75rem",
    children,
    containerClassName,
    borderClassName,
    duration,
    className,
    ...otherProps
}: ButtonProps) {
    return (
        <button
            className={cn(
                "bg-transparent relative text-xl h-12 w-40 p-[1px] overflow-hidden",
                containerClassName
            )}
            style={{ borderRadius }}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <MovingBorder duration={duration} rx="30%" ry="30%">
                    <div
                        className={cn(
                            "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
                            borderClassName
                        )}
                    />
                </MovingBorder>
            </div>

            <div
                className={cn(
                    "relative  border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
                    className
                )}
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                {children}
            </div>
        </button>
    );
}

export function ButtonGlass({
    borderRadius = "1.75rem",
    children,
    containerClassName,
    borderClassName,
    duration,
    className,
    ...otherProps
}: ButtonProps) {
    return (
        <button
            className={cn(
                "btn glass bg-white relative text-xl h-12 w-48 p-[1px] overflow-hidden",
                containerClassName
            )}
            style={{ borderRadius }}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <MovingBorder duration={duration} rx="30%" ry="30%">
                    <div
                        className={cn(
                            "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
                            borderClassName
                        )}
                    />
                </MovingBorder>
            </div>

            <div
                className={cn(
                    "relative  border border-slate-800 backdrop-blur-xl text-black hover:text-white flex items-center justify-center w-full h-full text-sm antialiased",
                    className
                )}
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                {children}
            </div>
        </button>
    );
}

interface CardProps {
    title: React.ReactNode;
    content: React.ReactNode;
    borderRadius?: string;
    duration?: number;
    className?: string;
    borderClassName?: string;
}

export const Card = ({
    title,
    content,
    borderRadius = "1.75 rem",
    duration = 2000,
    className,
    borderClassName,
}: CardProps) => {
    return (
        <div
            className={`relative overflow-hidden bg-black text-white rounded-sm shadow-lg p-6 ${className}`}
            style={{ borderRadius }}
        >
            <div
                className="absolute inset-0"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <MovingBorder duration={duration} rx="30%" ry="30%">
                    <div
                        className={`h-full w-full opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)] ${borderClassName}`}
                    />
                </MovingBorder>
            </div>
            <div
                className="relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl p-6 rounded-lg"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div>{content}</div>
            </div>
        </div>
    );
};
