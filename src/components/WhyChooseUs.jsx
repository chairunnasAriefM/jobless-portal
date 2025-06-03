// src/components/WhyChooseUs.jsx
import React from 'react';
import { CheckCircle, Zap, Users, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: <CheckCircle size={36} className="text-orange-500 mb-4" />,
        title: 'Higher Quality Job Listings',
        description: 'Only legit remote jobs. No ads, scams, or junk. Our team spends 200+ hours/day verifying every job.',
    },
    {
        icon: <Zap size={36} className="text-orange-500 mb-4" />,
        title: 'Faster Application Process',
        description: 'Streamlined applications and direct connections to hiring managers. Get noticed quicker.',
    },
    {
        icon: <Users size={36} className="text-orange-500 mb-4" />,
        title: 'Access to Top Companies',
        description: 'Connect with leading companies offering flexible and remote opportunities globally.',
    },
    {
        icon: <ShieldCheck size={36} className="text-orange-500 mb-4" />,
        title: 'Secure & Confidential',
        description: 'Your job search is private. We prioritize your data security and confidentiality.',
    },
];

const WhyChooseUs = () => {
    return (
        <section id="learn-more" className="py-16 bg-slate-50"> {/* ID untuk navigasi dari Hero */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                        How <span className="text-orange-500">JobPortal</span> is Different
                    </h2>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        We are dedicated to providing the best experience for your remote job search.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;