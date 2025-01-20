import { durations } from "@/utils/durations";
import React from "react";

interface BorrowData {
    id: number;
    title: string;
    date: string;
    images: string[];
    amount: number;
    duration?: number;
}

interface BorrowListProps {
    lists: BorrowData[]; // Define the type of the lists prop
}

const BorrowList: React.FC<BorrowListProps> = ({ lists }) => {
    if (!lists || lists.length === 0) {
        return <div>No lists available</div>;
    }

    return (
        <div className="max-h-96 overflow-y-scroll">
            {lists.map((list) => (
                <div key={list.id} role="alert" className="alert shadow-lg mb-4">
                    <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                        {list.images.map((img, index) => (
                            <div className="avatar" key={index}>
                                <div className="w-12">
                                    <img src={img} alt={`Avatar ${index + 1}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-bold">{list.title}</h3>
                        <div className="text-xs">{new Date(list.date).toLocaleString()}</div>
                    </div>
                    <button className="btn btn-sm text-xl">
                        ${list.amount}
                        <span className="text-sm">{list.duration !== undefined && ` / ${list.duration} Days`}</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BorrowList;
