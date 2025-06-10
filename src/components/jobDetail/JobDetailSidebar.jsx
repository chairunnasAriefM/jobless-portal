// src/components/jobDetail/JobDetailSidebar.jsx
import React from 'react';

const JobDetailSidebar = ({ job }) => {
    return (
        <aside className="w-full lg:w-1/3">
            <div className="sticky top-28 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <button className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-150">
                        Lamar Sekarang
                    </button>
                    <button className="w-full mt-3 bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition duration-150">
                        Simpan Pekerjaan
                    </button>
                </div>
                {/* Bisa ditambahkan komponen lain di sini, misal lowongan serupa */}
            </div>
        </aside>
    );
};

export default JobDetailSidebar;