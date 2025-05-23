import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.scss';

// Define the structure for each dropdown option
interface Option {
    id: string;
    label: string;
    icon: string;
}

// Props that the MultiSelect component accepts
interface MultiSelectProps {
    options: Option[];              // List of all available options
    selectedOptions: Option[];      // Currently selected options
    onChange: (selected: Option[]) => void;  // Callback when selection changes
    placeholder?: string;           // Optional placeholder text
}

/**
 * A customizable dropdown component that supports:
 * - Single item selection
 * - Adding new items
 * - Custom styling for selected items
 * - Emoji support for each option
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selectedOptions,
    onChange,
    placeholder = 'Select items...'
}) => {
    // Track dropdown open/close state
    const [isOpen, setIsOpen] = useState(false);
    
    // Track input field value for adding new items
    const [inputValue, setInputValue] = useState('');
    
    // Reference to detect clicks outside dropdown
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Close dropdown if click is outside
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
            // Create new option with unique ID and sparkle emoji
            const newOption: Option = {
                id: Date.now().toString(),
                label: inputValue.trim(),
                icon: '✨'
            };

            // Add and select the new option
            options.push(newOption);
            onChange([newOption]);
            
            // Clear input field
            setInputValue('');
            e.preventDefault();
        }
    };

    // Toggle selection state of an option
    const toggleOption = (option: Option) => {
        const isSelected = selectedOptions.some(selected => selected.id === option.id);
        
        // If already selected, clear selection
        // If not selected, make it the only selected item
        onChange(isSelected ? [] : [option]);
    };

    // Render an option's label with special formatting if selected
    const renderOptionLabel = (option: Option, isDropdownItem: boolean = false) => {
        const isSelected = selectedOptions.some(selected => selected.id === option.id);
        
        // Add "Yeeeah" prefix only for selected items in dropdown list
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
            {/* Dropdown header/trigger */}
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
                            {/* <span className="multi-select__emoji">{selectedOptions[0].icon}</span> */}
                        </>
                    )}
                </div>
                <span className={`multi-select__arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="multi-select__dropdown">
                    {/* Input for adding new items */}
                    <input
                        type="text"
                        className="multi-select__input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type and press Enter to add..."
                    />
                    
                    {/* List of options */}
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
                                {/* Option label with "Yeeeah" prefix if selected */}
                                {renderOptionLabel(option, true)}
                                
                                {/* Option emoji at the end */}
                                <span className="multi-select__emoji">
                                    {option.icon}
                                </span>
                                
                                {/* Checkmark for selected option */}
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
