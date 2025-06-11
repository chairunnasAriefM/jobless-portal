// src/components/searchWizard/StepIndicator.jsx
import React from 'react';

const StepIndicator = ({ currentStep, totalSteps }) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-6 md:mb-8">
            <div className="mb-2 text-sm font-medium text-slate-600">
                Langkah {currentStep} dari {totalSteps}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                    className="bg-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default StepIndicator;