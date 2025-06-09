import { useState, useEffect } from 'react';

const getBackgroundColor = (severity) => {
    switch (severity) {
        case 'error':
            return 'red-500';
        case 'warning':
            return 'yellow-500';
        case 'success':
            return 'green-500';
        case 'info':
            return 'blue-500';
        default:
            return 'gray-500';
    }
};

const Alert = ({ severity, message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 100000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    const bgColor = getBackgroundColor(severity);

    return (
        <div 
            className={`fixed top-4 right-4 bg-${bgColor} border-white border-1 text-white p-1 px-4 font-bold rounded-md shadow-lg z-50 animate-bounce`}
            style={{ animationIterationCount: 1 }}
        >
            <div className="flex items-center">
                <span className="mr-2">{message}</span>
                <button 
                    onClick={() => setVisible(false)}
                    className={`ml-4 text-2xl cursor-pointer px-1 hover:bg-white hover:text-${bgColor} rounded-sm`}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Alert; 