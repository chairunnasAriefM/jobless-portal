import React from 'react';

const GenericTable = ({ columns, data, renderRow }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} scope="col" className="px-6 py-4">
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {data.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                        {/* renderRow adalah fungsi dari parent yang mendefinisikan tampilan baris */}
                        {renderRow(item, index)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default GenericTable;
