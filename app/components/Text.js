"use client"
import { useState, useEffect } from 'react';
import Alert from './Alert';

const Text = ({ label, value = '', onChange, formData, required, defaultName, textCase, allowedCharacters }) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (defaultName && !value) {
            handleChange({ target: { value: `p-${formData && formData[defaultName] ? formData[defaultName] : ''}` } });
        }
    }, []);

    const handleChange = (e) => {
        const newValue = textCase === 'unchanged' ? e.target.value : e.target.value.toLowerCase();
        e.target.value = newValue;
        if (!allowedCharacters || allowedCharacters.test(newValue)) {
            onChange(e);
            setShowAlert(false);
        } else {
            setShowAlert(true);
        }
    };

    return (
        <div className="grid grid-cols-2 items-center">
            <label>{label}{required && <span className="text-red-500">*</span>}: </label>
            <input type="text" className="border m-4 bg-gray-100 text-black rounded-md py-1 pl-2" value={value} onChange={handleChange} />
            {showAlert && <Alert severity="error" message="Invalid content" />}
        </div>
    );
};

export default Text; 