import React from 'react';
import { Button } from '@mui/material';

const DownloadButton = ({ onClick, format, fromDb }) => (
  <Button onClick={() => onClick(format, fromDb)} variant="contained">
    Download {format.toUpperCase()}
  </Button>
);

export default DownloadButton;
