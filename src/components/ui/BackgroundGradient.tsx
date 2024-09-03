import React from 'react';

interface BackgroundGradientProps {
    className?: string;
    children: React.ReactNode;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ className, children }) => {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-70"></div>
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default BackgroundGradient;
