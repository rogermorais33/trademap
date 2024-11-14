import { TextField, Autocomplete, Chip } from '@mui/material';

const AutocompleteInput = ({ label, value, onChange, options }) => {
  const handleChange = (event, newValue) => {
    // Filter out duplicate values
    const uniqueValues = newValue.filter((val, index, self) => index === self.findIndex((t) => t.value === val.value));
    onChange(uniqueValues);
  };

  return (
    <Autocomplete
      multiple
      disablePortal
      options={options}
      value={value || []}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => <Chip key={index} label={option.label} {...getTagProps({ index })} />)
      }
    />
  );
};

export default AutocompleteInput;
