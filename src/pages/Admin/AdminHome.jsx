import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/dashboard/Admin/Home/StatCard';
import ChartCard from '../../components/dashboard/Admin/Home/ChartCard';
import TableCard from '../../components/dashboard/Admin/Home/TableCard';
import { Users, Briefcase, FileText, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { DashboardAPI } from '../../services/Admin/DashboardAPi';

// Komponen kustom untuk tooltip grafik agar lebih menarik
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                <p className="font-bold text-slate-800">{`Hari: ${label}`}</p>
                {payload.map((pld, index) => (
                    <p key={index} style={{ color: pld.stroke }}>
                        {`${pld.name}: ${pld.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Mengambil semua data statistik dalam satu panggilan API
                const data = await DashboardAPI.fetchDashboardStats();
                setDashboardData(data);
            } catch (err) {
                setError("Gagal memuat data dasbor.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []); // Dependensi kosong agar hanya berjalan sekali saat halaman dimuat

    const COLORS = ['#fb923c', '#475569']; // Oranye dan Slate

    // Tampilan saat data sedang dimuat
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;
    }

    // Tampilan jika terjadi error
    if (error) {
        return <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center"><AlertCircle size={18} className="mr-2" /> {error}</div>;
    }

    // Memproses data agar siap ditampilkan
    const stats = dashboardData?.stats;
    const formattedPieData = stats?.komposisiPengguna.map(item => ({
        ...item,
        // Mengubah 'pencari_kerja' menjadi 'Pencari Kerja'
        name: item.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    })) || [];

    return (
        <div className="space-y-8">
            {/* Kartu Statistik Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Pengguna" value={stats?.totalPengguna || 0} icon={<Users />} color="bg-blue-100 text-blue-600" />
                <StatCard title="Total Perusahaan" value={stats?.totalPerusahaan || 0} icon={<Briefcase />} color="bg-orange-100 text-orange-600" />
                <StatCard title="Lowongan Aktif" value={stats?.lowonganAktif || 0} icon={<FileText />} color="bg-green-100 text-green-600" />
                <StatCard title="Total Lamaran" value={stats?.totalLamaran || 0} icon={<TrendingUp />} color="bg-purple-100 text-purple-600" />
            </div>

            {/* Grafik */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="Laporan Aktivitas Mingguan">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dashboardData?.weeklyActivity || []}
                                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Pendaftar" stroke="#f97316" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} name="Pendaftar Baru" />
                                <Line type="monotone" dataKey="Lowongan" stroke="#475569" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} name="Lowongan Baru" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                <div>
                    <ChartCard title="Komposisi Pengguna">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={formattedPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                    {formattedPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            {/* Tabel Ringkasan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TableCard title="Lowongan Terbaru" columns={[{ key: 'judul', header: 'Judul' }, { key: 'perusahaan', header: 'Perusahaan' }]} data={stats?.lowonganTerbaru || []} />
                <TableCard title="Perusahaan Terpopuler" columns={[{ key: 'nama', header: 'Nama' }, { key: 'lowongan', header: 'Jumlah Lowongan' }]} data={dashboardData?.topCompanies || []} />
            </div>
        </div>
    );
};

export default DashboardPage;
