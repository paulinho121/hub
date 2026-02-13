import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ message = "Inicializando..." }) => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // If loading takes more than 3 seconds, show a reassuring message
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 p-6">
        {/* Simple lightweight logo or spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#FFD700] rounded-full border-t-transparent animate-spin"></div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-white text-lg font-medium tracking-wide animate-pulse">
            {message}
          </span>
          
          {showSlowMessage && (
            <span className="text-gray-500 text-sm fade-in">
              Isso está demorando um pouco mais que o normal...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;