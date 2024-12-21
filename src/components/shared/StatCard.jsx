import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StatCard = ({ title, value, trend, description }) => {
    const isPositive = trend >= 0;
    
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                {trend && (
                    <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                        <span className="ml-1">{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            {description && (
                <p className="text-gray-600 text-sm mt-2">{description}</p>
            )}
        </div>
    );
};

export default StatCard;