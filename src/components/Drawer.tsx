import React, { ReactNode, useState } from "react";

interface DrawerItem {
    label: string;
    content: ReactNode;
}

interface DrawerProps {
    drawerItems: DrawerItem[];
    classActiveTab: string;
    classDeactiveTab: string;
    classParent: string;
    title: string;
}

const Drawer: React.FC<DrawerProps> = ({ drawerItems, classActiveTab, classDeactiveTab, classParent, title }) => {
    const [activeTab, setActiveTab] = useState(0); // Default to the first tab,

    if (!drawerItems || drawerItems.length === 0) {
        return <div>No content available</div>;
    }

    return (
        <div className="drawer lg:drawer-open">
            {/* <input id="my-drawer-2" type="checkbox" className="drawer-toggle" /> */}
            <div className="drawer-content">
                <div className="flex flex-col h-auto w-full ">
                    {/* Button container */}
                    <div className="flex items-center justify-between overflow-x-auto ">
                        <p className={`text-xl font-semibold ${title ? 'block' : 'hidden'}`}>{title}</p>
                        <ul className={`flex space-x-3 ${classParent}`}>
                            {drawerItems.map((item, index) => (
                                <li key={index} className="flex-none">
                                    <button
                                        className={`${activeTab === index ? `${classActiveTab}` : `${classDeactiveTab}`}`}
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
