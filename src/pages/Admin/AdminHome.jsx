import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/dashboard/Admin/Home/StatCard';
import ChartCard from '../../components/dashboard/Admin/Home/ChartCard';
import TableCard from '../../components/dashboard/Admin/Home/TableCard';
import Header from '../../components/dashboard/Admin/Header';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
    // Data dummy untuk simulasi
    const reportData = [
        { name: 'Sen', Pendaftar: 30, Lowongan: 5 }, { name: 'Sel', Pendaftar: 45, Lowongan: 7 },
        { name: 'Rab', Pendaftar: 60, Lowongan: 8 }, { name: 'Kam', Pendaftar: 55, Lowongan: 6 },
        { name: 'Jum', Pendaftar: 70, Lowongan: 10 }, { name: 'Sab', Pendaftar: 90, Lowongan: 12 },
        { name: 'Min', Pendaftar: 85, Lowongan: 11 },
    ];
    const analyticsData = [{ name: 'Pencari Kerja', value: 400 }, { name: 'Perusahaan', value: 120 }];
    const COLORS = ['#fb923c', '#475569'];
    const recentJobsData = [{ id: 1, judul: 'UI/UX Designer', perusahaan: 'Kreasi Digital' }, { id: 2, judul: 'Backend Developer', perusahaan: 'Solusi Teknologi' }];
    const topCompaniesData = [{ id: 1, nama: 'PT Maju Jaya', lowongan: 15 }, { id: 2, nama: 'StartUp Keren', lowongan: 12 }];

    return (
        <div className="space-y-8">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Pengguna" value="1,250" icon={<Users />} color="bg-blue-100 text-blue-600" />
                <StatCard title="Total Perusahaan" value="340" icon={<Briefcase />} color="bg-orange-100 text-orange-600" />
                <StatCard title="Lowongan Aktif" value="890" icon={<FileText />} color="bg-green-100 text-green-600" />
                <StatCard title="Total Lamaran" value="3,420" icon={<TrendingUp />} color="bg-purple-100 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="Laporan Pendaftaran Mingguan">
                        <ResponsiveContainer>
                            <BarChart data={reportData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Pendaftar" fill="#f97316" name="Pendaftar Baru" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Lowongan" fill="#475569" name="Lowongan Baru" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                <div>
                    <ChartCard title="Komposisi Pengguna">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={analyticsData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                                    {analyticsData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TableCard title="Lowongan Terbaru" columns={[{ key: 'judul', header: 'Judul' }, { key: 'perusahaan', header: 'Perusahaan' }]} data={recentJobsData} />
                <TableCard title="Perusahaan Populer" columns={[{ key: 'nama', header: 'Nama' }, { key: 'lowongan', header: 'Jumlah Lowongan' }]} data={topCompaniesData} />
            </div>
        </div>
    );
};

export default DashboardPage;