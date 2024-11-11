import { ToggleButtonGroup, ToggleButton } from '@mui/material';

const ToggleButtonInput = ({ value, onChange, options }) => (
  <ToggleButtonGroup
    color="primary"
    value={value}
    exclusive
    onChange={(event, newValue) => onChange(newValue)}
    aria-label="Platform"
    sx={{ height: '56px' }}
  >
    {options.map((option) => (
      <ToggleButton key={option.value} value={option.value}>
        {option.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

export default ToggleButtonInput;
