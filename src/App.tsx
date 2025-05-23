import React, { useState } from 'react';
import { MultiSelect } from './components/MultiSelect/MultiSelect';
import './App.css';

// Sample initial options with emojis
const initialOptions = [
  { id: '1', label: 'Science', icon: '🧬' }, 
  { id: '2', label: 'Education', icon: '🎓' },
  { id: '3', label: 'Art', icon: '🎨' },
  { id: '4', label: 'Sport', icon: '⚽' },
  { id: '5', label: 'Games', icon: '🎮' },
  { id: '6', label: 'Health', icon: '🏥' },
];

const App: React.FC = () => {
  const [selected, setSelected] = useState<Array<{ id: string; label: string; icon: string }>>([]);

  const handleChange = (newSelected: Array<{ id: string; label: string; icon: string }>) => {
    setSelected(newSelected);
  };

  return (
    <div className="App">
      <div style={{ width: '400px' }}>
        <MultiSelect
          options={initialOptions}
          selectedOptions={selected}
          onChange={handleChange}
          placeholder="Science"
        />
      </div>
    </div>
  );
};

export default App;