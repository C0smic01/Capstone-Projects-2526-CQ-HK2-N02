import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

interface ErrorCardProps {
    title?: string;
    message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title = "Lỗi", message }) => {
    return (
        <div className="relative overflow-hidden">
            {/* Gradient background sáng hơn */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-700/50 via-red-600/40 to-red-800/60 backdrop-blur-xl rounded-3xl"></div>

            {/* Glow effect sáng hơn */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-500/20 rounded-3xl blur-xl"></div>

            {/* Border gradient sáng và nổi bật */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/80 via-red-500/60 to-red-600/80 p-[1px]">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-red-800/70 via-red-700/50 to-red-800/80 backdrop-blur-sm"></div>
            </div>

            {/* Content */}
            <div className="relative p-8 flex flex-col space-y-5">
                {/* Header với icon và animation */}
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-400/50 rounded-full blur-lg animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-red-400 to-red-500 p-2 rounded-xl shadow-lg border border-red-300/30">
                            <XCircle className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {title}
                    </h3>
                </div>

                <div className="pl-11">
                    <p className="text-red-50 leading-relaxed whitespace-pre-wrap font-medium drop-shadow-md text-shadow-lg">
                        {message}
                    </p>
                </div>

                <div className="absolute top-4 right-4 opacity-30">
                    <AlertTriangle className="w-8 h-8 text-red-300 drop-shadow-md" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-400/80 to-transparent shadow-lg"></div>
        </div>
    );
};


export default ErrorCard;