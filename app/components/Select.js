"use client"

const Select = ({ label, options, value = '', onChange, required, formData }) => {
    let processedOptions = options;
    
    if (typeof options === 'string' && formData) {
        if (formData[options] && formData[options].length > 0) {
            processedOptions = formData[options].reduce((acc, item) => {
                acc[item.name] = item.name;
                return acc;
            }, {});
        } else {
            processedOptions = { 'No pools. First configure a pool': '' };
        }
    }

    return (
        <div className="grid grid-cols-2 items-center">
            <label>{label}{required && <span className="text-red-500">*</span>}:</label>
            <select value={value} onChange={onChange} className="border m-4 bg-gray-100 text-black rounded-md py-1">
                <option value="" disabled className="text-gray-400 italic">Select an option</option>
                {Object.keys(processedOptions).map((option) => (
                    <option key={option} value={processedOptions[option]} disabled={!processedOptions[option]} className="border m-4 bg-gray-100 rounded-md text-black">{option}</option>
                ))}
            </select>
        </div>
    )
}

export default Select; 