"use client"

const Bool = ({ label, value = false, onChange, required }) => {
    const handleChange = (e) => {
        onChange({ target: { value: e.target.checked } });
    };

    return (
        <div className="flex items-center justify-between">
            <label className="mr-4">{label}{required && <span className="text-red-500">*</span>}: </label>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={value} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
};

export default Bool; 