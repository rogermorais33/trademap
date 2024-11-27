import { TextField, Autocomplete, Chip, createFilterOptions } from '@mui/material';
import { useMemo } from 'react';

const AutocompleteInput = ({ label, value, onChange, options }) => {
  // Filter out duplicate values
  const handleChange = useMemo(
    () => (event, newValue) => {
      const uniqueValues = newValue.filter(
        (val, index, self) => index === self.findIndex((t) => t.value === val.value),
      );
      onChange(uniqueValues);
    },
    [onChange],
  );

  const filterOptions = useMemo(
    () =>
      createFilterOptions({
        matchFrom: 'any',
        limit: 350,
      }),
    [],
  );

  return (
    <Autocomplete
      multiple
      disablePortal
      options={options}
      value={value || []}
      onChange={handleChange}
      filterOptions={filterOptions}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderTags={(value, getTagProps) =>
        // Destructure the props and remove the key
        value.map((option, index) => {
          const { key, ...chipProps } = getTagProps({ index });
          return <Chip key={option.value || index} label={option.label} {...chipProps} />;
        })
      }
    />
  );
};

export default AutocompleteInput;
