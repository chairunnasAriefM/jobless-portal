import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded-full">
                <MoreHorizontal size={20} />
            </button>
        </div>
        <div className="h-72">
            {children}
        </div>
    </div>
);

export default ChartCard;