import React, { ReactNode, useState } from "react";

interface DrawerItem {
    label: string;
    content: ReactNode;
}

interface DrawerProps {
    drawerItems: DrawerItem[];
    bgCustom: string;
}

const Drawer: React.FC<DrawerProps> = ({ drawerItems, bgCustom }) => {
    const [activeTab, setActiveTab] = useState(0); // Default to the first tab

    if (!drawerItems || drawerItems.length === 0) {
        return <div>No content available</div>;
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="flex flex-col h-full w-full ">
                    {/* Button container */}
                    <div className="flex overflow-x-auto ">
                        <ul className="flex space-x-3 py-4">
                            {drawerItems.map((item, index) => (
                                <li key={index} className="flex-none">
                                    <button
                                        className={`py-2 px-4 rounded-lg text-left ${activeTab === index ? `${bgCustom} text-white` : "bg-transparent border border-gray-800 text-white"}`}
                                        onClick={() => setActiveTab(index)}
                                        aria-selected={activeTab === index}
                                    >
                                        {item.label}
                                    </button>

                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Content area */}
                    <div className="py-4 overflow-y-auto">
                        {drawerItems[activeTab].content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Drawer;
