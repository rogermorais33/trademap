import { TextField, Autocomplete } from '@mui/material';

const AutocompleteInput = ({ label, value, onChange, options }) => (
  <Autocomplete
    disablePortal
    options={options}
    value={value}
    onChange={(event, newValue) => onChange(newValue)}
    renderInput={(params) => <TextField {...params} label={label} />}
  />
);

export default AutocompleteInput;
