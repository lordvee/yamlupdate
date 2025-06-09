"use client"
import { useState } from 'react';
import conf from "../app/configuration/allowedValues";
import { Bool, Text, Select, ArrayComponent, Integer, Calculated } from "../app/components/Inputs";
import yaml from 'js-yaml';
import Alert from '../app/components/Alert';
import { faFileCode, faCopy, faUndo, faRotate, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { renderComponent } from "../app/components/RenderComponent";


const isEmptyOrNullOrUndefined = (value) => {
    return value === '' || value === null || value === undefined;
}

const initializeFormData = () => {
    const initialData = {};
    Object.entries(conf).forEach(([key, config]) => {
        if (config.type === 'select') {
            initialData[key] = Object.values(config.options)[0];
        } else if (config.type === 'bool') {
            initialData[key] = false;
        } else {
            initialData[key] = '';
        }
    });
    return initialData;
};

export default function Form({ configValues }) {
    const [formData, setFormData] = useState({});
    const [yamlOutput, setYamlOutput] = useState('');
    const [showYamlOutput, setShowYamlOutput] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [yamlGenerationStarted, setYamlGenerationStarted] = useState(false);

    const handleChange = (key, e) => {
        setFormData((prevData) => {
            // Handle array values (from ArrayComponent)
            if (e.target && e.target.isArray) {
                return {
                    ...prevData,
                    [key]: e.target.value
                };
            }
            // Handle regular values
            return {
                ...prevData,
                [key]: e.target.value,
            };
        });
    };

    const handleReset = () => {
        setFormData({});
        setYamlOutput('');
        setShowYamlOutput(false);
        setValidationErrors([]);
        setYamlGenerationStarted(false);
    };

    const cleanEmptyValues = (obj) => {
        if (Array.isArray(obj)) {
            return obj
                .map(item => cleanEmptyValues(item))
                .filter(item => item !== null && item !== undefined && item !== '');
        }

        if (obj && typeof obj === 'object') {
            const cleaned = {};
            for (const [key, value] of Object.entries(obj)) {
                const cleanedValue = cleanEmptyValues(value);
                if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== '') {
                    cleaned[key] = cleanedValue;
                }
            }
            return Object.keys(cleaned).length > 0 ? cleaned : null;
        }

        return obj === '' ? null : obj;
    };

    const generateYaml = (e) => {
        e.preventDefault();
        setYamlGenerationStarted(true);
        // Reset validation errors
        setValidationErrors([]);

        // Validate required fields
        const missingRequiredFields = Object.entries(conf).filter(([key, config]) => {
            return config.required && (!formData[key] || formData[key].trim() === '');
        });

        if (missingRequiredFields.length > 0) {
            setValidationErrors(missingRequiredFields.map(([key]) => (<span>{`${key}`}<span className="font-normal"> is required.</span></span>)));
            return;
        }

        // Validate IP addresses
        const invalidValues = Object.entries(formData).filter(([key, value]) => {
            const config = conf[key];
            const regex = typeof config.regex === 'string' ? new RegExp(config.regex) : config.regex;
            return !isEmptyOrNullOrUndefined(value) && config.regex && !regex.test(value);
        });

        if (invalidValues.length > 0) {
            setValidationErrors(invalidValues.map(([key]) => `${key} is not a valid value.`));
            return;
        }

        // Clean empty values recursively
        const cleanedFormData = cleanEmptyValues(formData);

        const formDataWithShowInYamlIsFalse = Object.entries(conf).filter(([key, config]) => !config.noYaml).reduce((acc, [key, config]) => {
            acc[key] = formData[key];
            return acc;
        }, {});

        const formDataWithDefaultPool = {
            ...formDataWithShowInYamlIsFalse,
            defaultPool: formData.pools && formData.pools.length > 0 ? cleanEmptyValues(formData.pools[0]) : {}
        }

        const yamlString = yaml.dump([formDataWithDefaultPool], { noRefs: true });
        setYamlOutput(yamlString);
        setShowYamlOutput(true);
        setYamlGenerationStarted(false);
    };

    const handleGoBack = () => {
        setShowYamlOutput(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(yamlOutput).then(() => {
            alert('YAML content copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleUploadToGitHub = async () => {
        try {
            const owner = 'lordvee';
            const repo = 'yamlupdate';
            const branch = 'experiment';
            const path = 'config.yaml';
            
            // First, get the current file content to get its SHA
            const getFileResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                    }
                }
            );

            const fileData = await getFileResponse.json();
            const currentSha = fileData.sha;

            // Prepare the content for upload
            const content = btoa(yamlOutput); // Base64 encode the YAML content

            // Update the file
            const updateResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: 'Update YAML configuration',
                        content: content,
                        branch: branch,
                        sha: currentSha
                    })
                }
            );

            if (!updateResponse.ok) {
                throw new Error('Failed to update file');
            }

            alert('Successfully uploaded to GitHub!');
        } catch (error) {
            console.error('Error uploading to GitHub:', error);
            alert('Failed to upload to GitHub. Please check the console for details.');
        }
    };

    return (
        <form className="flex flex-col gap-1" onSubmit={generateYaml}>
            {validationErrors.length > 0 && yamlGenerationStarted && (
                <Alert key={Date.now()} severity="error" message={validationErrors.map(error => 
                    <div key={JSON.stringify(error)} className="flex flex-row gap-2"><FontAwesomeIcon icon={faArrowRight} /> {error}</div>
                )} />
            )}
            {!showYamlOutput ? (
                <>
                    {Object.entries(conf)
                        .filter(([key, config]) => !config.advanced || (config.advanced && configValues.advanced))
                        .filter(([key, config]) => !config.template || (config.template && config.template.includes(configValues.template)))
                        .map(([key, config]) => renderComponent({ key, config, configValues, formData, handleChange }))}
                    <div className="fixed bottom-4 right-4 flex gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-500 hover:bg-gray-700 text-white p-2 px-4 rounded cursor-pointer text-lg font-bold z-50"
                        >
                            <FontAwesomeIcon icon={faRotate} />
                            <span className="ml-2">Reset Form</span>
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white p-2 px-4 rounded cursor-pointer text-lg font-bold z-50"
                        >
                            <FontAwesomeIcon icon={faFileCode} />
                            <span className="ml-2">Generate YAML</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={handleUploadToGitHub} 
                            className="bg-green-600 hover:bg-green-700 text-white p-2 px-4 rounded cursor-pointer text-lg font-bold z-50"
                        >
                            <FontAwesomeIcon icon={faGithub} />
                            <span className="ml-2">Upload to GitHub</span>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <Alert
                        severity="success"
                        message="Yaml generated successfully"
                    />
                    <textarea
                        readOnly
                        value={yamlOutput}
                        className="border p-4 m-4 bg-gray-100 text-black min-h-40 rounded-md font-mono"
                        cols="100"
                        rows="15"
                    />
                    <button type="button" onClick={copyToClipboard} className="bg-green-500 text-white p-2 rounded cursor-pointer">
                        <FontAwesomeIcon icon={faCopy} />
                        <span className="ml-2">Copy to Clipboard</span>
                    </button>
                    <button type="button" onClick={handleGoBack} className="bg-gray-500 text-white p-2 rounded cursor-pointer">
                        <FontAwesomeIcon icon={faUndo} />
                        <span className="ml-2">Back to Configuration</span>
                    </button>
                    
                </>
            )}
        </form>
    );
}