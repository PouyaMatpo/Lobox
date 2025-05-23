import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelect } from './MultiSelect';
import '@testing-library/jest-dom';

describe('MultiSelect Component', () => {
    const mockOptions = [
        { id: '1', label: 'Option 1', icon: '🌟' },
        { id: '2', label: 'Option 2', icon: '💫' },
        { id: '3', label: 'Option 3', icon: '⭐' }
    ];

    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('renders with placeholder when no options are selected', () => {
        render(
            <MultiSelect
                options={mockOptions}
                selectedOptions={[]}
                onChange={mockOnChange}
                placeholder="Test placeholder"
            />
        );

        expect(screen.getByText('Test placeholder')).toBeInTheDocument();
    });

    test('allows selecting an option from dropdown', () => {
        render(
            <MultiSelect
                options={mockOptions}
                selectedOptions={[]}
                onChange={mockOnChange}
                placeholder="Test placeholder"
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Test placeholder'));
        
        // Click on an option
        fireEvent.click(screen.getByText('Option 1'));
        
        // Verify onChange was called with the correct option
        expect(mockOnChange).toHaveBeenCalledWith([mockOptions[0]]);
    });

    test('allows adding a new option', () => {
        render(
            <MultiSelect
                options={mockOptions}
                selectedOptions={[]}
                onChange={mockOnChange}
                placeholder="Test placeholder"
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Test placeholder'));
        
        // Type in the input field
        const input = screen.getByPlaceholderText('Type and press Enter to add...');
        fireEvent.change(input, { target: { value: 'New Option' } });
        
        // Press Enter
        fireEvent.keyDown(input, { key: 'Enter' });
          // Verify onChange was called with a new option
        expect(mockOnChange).toHaveBeenCalled();
        const calledWith = mockOnChange.mock.calls[0][0][0]; // Get the first option from the first call
        expect(calledWith.label).toBe('New Option');
        expect(calledWith.icon).toBe('✨');
    });
});
