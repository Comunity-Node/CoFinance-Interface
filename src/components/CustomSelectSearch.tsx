import React from 'react';
import Select, { components } from 'react-select';

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: '#141414',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '5px 3px',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#fff',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#1f2937',
    }),
    option: (provided: any, state: { isSelected: any }) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#374151' : '#141414',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#374151',
        },
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
};

// Custom Option component
const CustomOption = (props: any) => (
    <components.Option {...props}>
        <div className="flex items-center">
            {props.data.image && (
                <img
                    src={props.data.image}
                    alt={props.data.label}
                    className="w-6 h-6 rounded-full mr-3"
                />
            )}
            <span>{props.data.label}</span>
        </div>
    </components.Option>
);

// Custom SingleValue component
const CustomSingleValue = (props: any) => (
    <components.SingleValue {...props}>
        <div className="flex items-center">
            {props.data.image && (
                <img
                    src={props.data.image}
                    alt={props.data.label}
                    className="w-6 h-6 rounded-full mr-3"
                />
            )}
            <span>{props.data.label}</span>
        </div>
    </components.SingleValue>
);

interface CustomSelectSearchProps {
    tokenOptions: Array<{ value: string; label: string; image?: string }>;
    handleOnChange: (selectedOption: any) => void;
    handleValue: any;
    className: string;
    placeholder: string;
    onInputChange?: (inputValue: string) => void; 
}

const CustomSelectSearch: React.FC<CustomSelectSearchProps> = ({
    tokenOptions,
    handleOnChange,
    handleValue,
    className,
    placeholder,
    onInputChange
}) => {
    return (
        <div className="w-full">
            <Select
                isSearchable={true}
                options={tokenOptions}
                value={handleValue}
                onChange={handleOnChange}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                styles={customStyles}
                onInputChange={onInputChange}
                className={className}
                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                placeholder={placeholder}
            />
        </div>
    );
};

export default CustomSelectSearch;
