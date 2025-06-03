import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedCompanies from '../components/TrustedCompanies';
import FeaturedJobs from '../components/FeaturedJobs';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';


export default function Index() {
    return (
        <div className="bg-slate-50 text-gray-800"> {/* Latar belakang default untuk seluruh halaman */}
            <Navbar />
            <Hero />
            <TrustedCompanies />
            <FeaturedJobs />
            <WhyChooseUs />
            <Testimonials />
            <CallToAction />
            <Footer />

            {/* Placeholder untuk konten halaman lainnya
            <div className="h-96 container mx-auto p-8">
                <h2 className="text-2xl font-semibold">Konten Selanjutnya di Sini...</h2>
            </div> */}
        </div>
    )
}