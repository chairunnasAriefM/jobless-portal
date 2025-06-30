import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const DataTable = ({ columns, data, renderRow, sortConfig, requestSort }) => {

    // Fungsi untuk menampilkan ikon sorting yang sesuai
    const getSortIcon = (key) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown size={14} className="ml-2 text-slate-300" />;
        }
        if (sortConfig.direction === 'ascending') {
            // Ikon menunjuk ke atas
            return <ArrowUpDown size={14} className="ml-2 text-orange-500 transform rotate-180" />;
        }
        // Ikon menunjuk ke bawah
        return <ArrowUpDown size={14} className="ml-2 text-orange-500" />;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} scope="col" className={`px-6 py-4 ${col.className || ''}`}>
                                {col.sortable ? (
                                    <button onClick={() => requestSort(col.key)} className="flex items-center hover:text-orange-600 transition-colors">
                                        {col.header}
                                        {getSortIcon(col.key)}
                                    </button>
                                ) : (
                                    <span className="flex items-center">{col.header}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {data.map((item, index) => (
                        <tr key={item.user_id || index} className="hover:bg-slate-50 transition-colors">
                            {/* renderRow akan dipanggil di sini untuk setiap baris data */}
                            {renderRow(item)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
