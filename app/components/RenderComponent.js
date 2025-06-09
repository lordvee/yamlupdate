import { Text, Select, ArrayComponent, Integer, Bool, Calculated } from './Inputs';

export const renderComponent = ({key, config, formData, handleChange, configValues = { advanced: false }, newElement = null}) => {
    const { type, min, max, options, regex, advanced, allowedCharacters, textCase, defaultName, ...rest } = config;
    let Component;

    // Skip rendering if advanced is true and configValues.advanced is false
    if (advanced && !configValues.advanced) {
        return null;
    }

    switch (type) {
        case 'text':
            Component = Text;
            break;
        case 'select':
            Component = Select;
            break;
        case 'array':
            Component = ArrayComponent;
            break;
        case 'integer':
            Component = Integer;
            break;
        case 'bool':
            Component = Bool;
            break;
        case 'calculated':
            Component = Calculated;
            break;
        case 'object':
            return (
                <div key={key} className="ml-8 mt-8 flex flex-col gap-2 bg-gray-900 p-4 rounded-md">
                    <label className="font-bold">{key} configuration:</label>
                    {Object.entries(options).map(([subKey, subConfig]) =>
                        renderComponent({
                            key: `${key}.${subKey}`, 
                            config: subConfig, 
                            formData, 
                            handleChange, 
                            configValues, 
                            newElement: newElement ? newElement[key] : null
                        })
                    )}
                </div>
            );
        default:
            return null;
    }

    return (
        <Component
            textCase={textCase}
            className="grid grid-cols-1 items-center"
            key={key}
            config={config}
            label={key.split('.').pop()}
            value={newElement ? newElement[key.split('.').pop()] : formData && formData[key] ? formData[key] : ''}
            onChange={(e) => handleChange(key, e)}
            min={min}
            max={max}
            options={options}
            formData={formData}
            regex={regex}
            defaultName={defaultName}
            allowedCharacters={allowedCharacters}
            configValues={configValues}
            {...rest}
        />
    );
}; 