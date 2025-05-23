import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.scss';

interface Option {
    id: string;
    label: string;
    icon: string;
}

interface MultiSelectProps {
    options: Option[];             
    selectedOptions: Option[];     
    onChange: (selected: Option[]) => void;  
    placeholder?: string;          
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selectedOptions,
    onChange,
    placeholder = 'Select items...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const [inputValue, setInputValue] = useState('');
    
    // Reference to detect clicks outside dropdown
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        
        // Cleanup listener on component unmount
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update input field as user types
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Handle creating new items when Enter is pressed
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const newOption: Option = {
                id: Date.now().toString(),
                label: inputValue.trim(),
                icon: '✨'
            };

            options.push(newOption);
            onChange([newOption]);
            
            setInputValue('');
            e.preventDefault();
        }
    };

    // Toggle selection state of an option
    const toggleOption = (option: Option) => {
        const isSelected = selectedOptions.some(selected => selected.id === option.id);
        
        onChange(isSelected ? [] : [option]);
    };

    // Render an option's label with special formatting if selected
    const renderOptionLabel = (option: Option, isDropdownItem: boolean = false) => {
        const isSelected = selectedOptions.some(selected => selected.id === option.id);
        
        if (isSelected && isDropdownItem) {
            return (
                <span className="multi-select__selected-label">
                    <span className="multi-select__yeeeah">Yeeeah</span>
                    <span className="multi-select__separator">,&nbsp;</span>
                    {option.label}!
                </span>
            );
        }
        
        return option.label;
    };

    return (
        <div className="multi-select" ref={containerRef}>
            <div
                className={`multi-select__selected ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="multi-select__title">
                    {selectedOptions.length === 0 ? (
                        <span className="multi-select__placeholder">{placeholder}</span>
                    ) : (
                        <>
                            {renderOptionLabel(selectedOptions[0])}
                        </>
                    )}
                </div>
                <span className={`multi-select__arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="multi-select__dropdown">
                    <input
                        type="text"
                        className="multi-select__input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type and press Enter to add..."
                    />
                    
                    <div className="multi-select__options">
                        {options.map(option => (
                            <div
                                key={option.id}
                                className={`multi-select__option ${
                                    selectedOptions.some(selected => selected.id === option.id) 
                                    ? 'selected' 
                                    : ''
                                }`}
                                onClick={() => toggleOption(option)}
                            >
                                {renderOptionLabel(option, true)}
                                
                                <span className="multi-select__emoji">
                                    {option.icon}
                                </span>
                                
                                {selectedOptions.some(
                                    selected => selected.id === option.id
                                ) && (
                                    <span className="multi-select__check">✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};