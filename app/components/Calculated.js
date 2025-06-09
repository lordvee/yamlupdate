"use client"
import Select from './Select';

const Calculated = ({ label, value = '', onChange, field, formData, options, required }) => {
    const handleChange = (e) => {
        onChange({ target: { value: e.target.value } });
    };

    const noFieldOptions = `No ${field} entered`;
    const selectOptions = formData && formData[field] && Array.isArray(formData[field]) ? formData[field].reduce((acc, item) => {
        acc[item.name] = item.name;
        return acc;
    }, {}) : {[noFieldOptions]: 'No options'};

    return (
        <Select label={label} options={selectOptions} value={formData[field][formData[field].length - 1].name} onChange={handleChange} required={required} />
    );
}

export default Calculated; 