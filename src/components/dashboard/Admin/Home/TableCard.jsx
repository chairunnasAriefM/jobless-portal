import React from 'react';

const TableCard = ({ title, columns, data }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        {columns.map(col => <th key={col.key} scope="col" className="px-4 py-3">{col.header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
                            {columns.map(col => <td key={col.key} className="px-4 py-3 font-medium text-slate-800">{item[col.key]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default TableCard;