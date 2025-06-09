import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Bool, Select } from '../app/components/Inputs';

export default function Configuration({ configValues,setConfigValues }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="relative inline-block text-left pl-2">
            <button onClick={toggleDropdown} className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 cursor-pointer">
                <FontAwesomeIcon icon={faCog} />
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white text-black ring-1 ring-black ring-opacity-5">
                    <div className="py-1 m-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <Bool 
                            label="Advanced options" 
                            value={configValues.advanced} 
                            onChange={(e) => setConfigValues({...configValues, advanced: !configValues.advanced})} 
                        />
                        <Select 
                            label="Template" 
                            options={{'fastl4': 'fastl4', 'http':'http', 'https': 'https', 'waf': 'waf'}} 
                            value={configValues.template} 
                            onChange={(e) => setConfigValues({...configValues, template: e.target.value})} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 