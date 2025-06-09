"use client"
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Alert from './Alert';
import { renderComponent } from './RenderComponent';
import Snackbar from './Snackbar';

const ArrayComponent = ({ label, config, value = [], onChange, formData, options, required, configValues }) => {
    const [values, setValues] = useState(value);
    const [showOverlay, setShowOverlay] = useState(false);
    const [newElement, setNewElement] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const { maxLength } = config;

    useEffect(() => {
        setValues(value);
    }, [value]);

    const initializeNestedObject = (options) => {
        return Object.keys(options).reduce((acc, key) => {
            if (options[key].type === 'object') {
                acc[key] = initializeNestedObject(options[key].options);
            } else {
                acc[key] = '';
            }
            return acc;
        }, {});
    };

    const validateRequiredFields = (element, options, parentKey = '') => {
        const errors = [];
        Object.entries(options).forEach(([key, config]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (config.required) {
                if (config.type === 'object') {
                    errors.push(...validateRequiredFields(element[key] || {}, config.options, fullKey));
                } else if (!element[key] || element[key].toString().trim() === '') {
                    errors.push(`${fullKey} is required`);
                }
            }
        });
        return errors;
    };

    const handleAdd = () => {
        if (values.length >= maxLength) {
            setValidationErrors([`Currently the tool allows for only one element of ${label} to be configured.`]);
            return;
        }
        setShowOverlay(true);
        setNewElement(initializeNestedObject(options));
        setEditingIndex(null);
        setValidationErrors([]);
    };

    const handleEdit = (index) => {
        setNewElement(values[index]);
        setEditingIndex(index);
        setShowOverlay(true);
        setValidationErrors([]);
    };

    const handleCancel = () => {
        setShowOverlay(false);
        setNewElement({});
        setEditingIndex(null);
        setValidationErrors([]);
    };

    const handleDone = () => {
        const errors = validateRequiredFields(newElement, options);
        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        const updatedValues = [...values];
        if (editingIndex !== null) {
            updatedValues[editingIndex] = newElement;
        } else {
            updatedValues.unshift(newElement);
        }
        setValues(updatedValues);
        onChange({ target: { value: updatedValues, isArray: true } });
        setShowOverlay(false);
        setNewElement({});
        setEditingIndex(null);
        setValidationErrors([]);
    };

    const handleRemove = (index) => {
        const updatedValues = values.filter((_, i) => i !== index);
        setValues(updatedValues);
        onChange({ target: { value: updatedValues, isArray: true } });
    };

    const handleChange = (key, e) => {
        const newValue = e.target ? e.target.value : e;
        setNewElement((prev) => {
            const updated = { ...prev };
            const keys = key.split('.');
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = newValue;
            return updated;
        });
    };

    return (
        <div className="grid grid-cols-2 items-center p-1 rounded-md">
            {validationErrors.length > 0 && (
                <Alert
                    severity="error"
                    message={validationErrors.map(error => `• ${error}`).join('\n')}
                />
            )}
            <label>{label}{required && <span className="text-red-500">*</span>}:</label>
            <div className="flex flex-row w-[400px]">
                <button type="button" onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white p-1 px-4 rounded m-1 cursor-pointer shrink-0">
                    <FontAwesomeIcon icon={faPlus} /> Add
                </button>
                <div className="flex flex-row gap-1">
                    {values.length > 0 && (
                        values.map((val, index) => (
                            <Snackbar
                                key={index}
                                content={val}
                                onEdit={() => handleEdit(index)}
                                onRemove={() => handleRemove(index)}
                            />
                        ))
                    )}
                </div>
            </div>
            {showOverlay && (
                <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center">
                    <div className="bg-black text-white p-4 rounded-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-white font-bold text-lg"><span className="text-green-500">{label}</span> configuration</h2>
                        {Object.entries(options).map(([key, config]) =>
                            renderComponent({ key, config, values, handleChange, formData, configValues, newElement })
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white p-2 rounded cursor-pointer">Cancel</button>
                            <button type="button" onClick={handleDone} className="bg-blue-500 text-white p-2 rounded cursor-pointer">Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ArrayComponent; 