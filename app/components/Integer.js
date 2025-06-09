"use client"

const Integer = ({ label, value = '', onChange, min, max, required }) => {
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (newValue === '' || (Number(newValue) >= min && Number(newValue) <= max)) {
            onChange({ target: { value: newValue } });
        }
    };

    return (
        <div className="grid grid-cols-2 items-center">
            <label>{label}{required && <span className="text-red-500">*</span>}:</label>
            <input
                type="number"
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                className="border m-4 bg-gray-100 text-black rounded-md py-1"
            />
        </div>
    );
};

export default Integer; 