'use client';

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
        width: '100%',
        maxHeight: '100px',
        overflowY: 'scroll'
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#fff',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#1f2937',
    }),
    option: (provided: any, state: { isSelected: any; }) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#374151' : '#141414',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#374151',
        },

    }),
    indicatorSeparator: (provided: any) => ({
        display: 'none',
    }),
    input: (provided: any) => ({
        ...provided,
        color: '#fff',
    }),
};

// Custom Option component to display images and text
const CustomOption = (props: any, useImage: boolean) => {
    return (
        <components.Option {...props}>
            <div className="flex items-center">
                <img
                    src={props.data.image}
                    alt={props.data.name}
                    className="w-6 h-6 rounded-full mr-3"
                />
                {props.data.name}
            </div>
        </components.Option>
    );
};

// Custom SingleValue component to display selected option with image
const CustomSingleValue = (props: any, useImage: boolean) => {
    return (
        <components.SingleValue {...props}>
            <div className="flex items-center">
                <img
                    src={props.data.image}
                    alt={props.data.name}
                    className="w-6 h-6 rounded-full mr-3"
                />
                {props.data.name}
            </div>
        </components.SingleValue>
    );
};


interface TokenOption {
    value: string;
    name: string;
    image: string;
}

interface CustomSelectSearchProps {
    tokenOptions: TokenOption[];
    handleOnChange: (selectedValue: TokenOption | null) => void;
    handleValue: TokenOption | null;
    className: string
}

const CustomSelectSearch: React.FC<CustomSelectSearchProps> = ({ tokenOptions, handleOnChange, handleValue }) => {
    return (
        <div className="w-full">
            <Select
                isSearchable={true}
                options={tokenOptions}
                value={handleValue}
                onChange={handleOnChange}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.value}
                styles={customStyles}
                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                placeholder="Choose Token" />
        </div>
    );
};

export default CustomSelectSearch;
