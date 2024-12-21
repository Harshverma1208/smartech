// src/components/shared/Button.jsx
import React from 'react';

const Button = ({ 
    variant = 'primary', 
    size = 'medium', 
    children, 
    className = '', 
    ...props 
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-colors duration-200';
    
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
    
    const sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;