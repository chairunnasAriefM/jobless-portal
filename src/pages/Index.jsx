import React from 'react';
import Hero from '../components/Hero';
import TrustedCompanies from '../components/TrustedCompanies';
import FeaturedJobs from '../components/FeaturedJobs';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

export default function Index() {
    return (
        <div id='home'>
            <Hero />
            <TrustedCompanies />
            <FeaturedJobs />
            <WhyChooseUs />
            <Testimonials />
            <CallToAction />
        </div>
    );
}