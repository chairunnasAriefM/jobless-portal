// src/components/searchWizard/StepNavigation.jsx
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const StepNavigation = ({ currentStep, totalSteps, prevStep, nextStep }) => {
    return (
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-slate-200 p-4 sm:p-5 z-50 shadow-top-soft">
            <div className="container mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-0"> {/* Sesuaikan max-width dengan container utama wizard */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="w-full sm:w-auto order-2 sm:order-1 py-3 px-6 text-sm font-semibold text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Kembali
                    </button>
                    <button
                        onClick={nextStep}
                        className="w-full sm:w-auto order-1 sm:order-2 py-3 px-8 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 flex items-center justify-center transition-colors duration-150"
                    >
                        {currentStep === totalSteps ? 'Selesai & Lihat Lowongan' : 'Berikutnya'}
                        {currentStep !== totalSteps && <ArrowRight size={18} className="ml-2" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepNavigation;