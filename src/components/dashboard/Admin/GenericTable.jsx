import React from 'react';

const GenericTable = ({ columns, data, renderRow }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 tracking-wide border-b border-slate-200">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-4 text-left font-semibold"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                } hover:bg-orange-50`}
                        >
                            {renderRow(item, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenericTable;
