import React, { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectWithOtherProps {
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  otherPlaceholder?: string;
  otherLabel?: string;
  className?: string;
}

export const SelectWithOther: React.FC<SelectWithOtherProps> = ({
  options,
  value,
  onChange,
  label,
  otherPlaceholder = 'Veuillez préciser',
  otherLabel = 'Autre...',
  className = ''
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [otherValue, setOtherValue] = useState('');
  const [showOther, setShowOther] = useState(false);

  useEffect(() => {
    // Check if current value matches any option
    const matchingOption = options.find(opt => opt.value === value);
    if (!matchingOption && value) {
      setSelectedValue('other');
      setOtherValue(value);
      setShowOther(true);
    } else {
      setSelectedValue(value);
      setShowOther(value === 'other');
    }
  }, [value, options]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setShowOther(newValue === 'other');
    onChange(newValue === 'other' ? otherValue : newValue);
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOtherValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
      >
        <option value="">Sélectionnez une option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showOther && (
        <input
          type="text"
          value={otherValue}
          onChange={handleOtherChange}
          placeholder={otherPlaceholder}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      )}
    </div>
  );
};
