// src/components/ui/Avatar.jsx
import React from 'react';

const Avatar = ({ name, size = 'md' }) => {
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.split(' ');
        if (words.length > 1) {
            return words[0][0] + words[words.length - 1][0];
        }
        return name.substring(0, 2);
    };

    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
    };

    return (
        <div className={`flex-shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold ${sizeClasses[size]}`}>
            {getInitials(name).toUpperCase()}
        </div>
    );
};

export default Avatar;