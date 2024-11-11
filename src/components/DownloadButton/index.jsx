import React from 'react';
import { Button } from '@mui/material';

const DownloadButton = ({ onClick, format }) => (
  <Button onClick={() => onClick(format)} variant="contained">
    Download {format.toUpperCase()}
  </Button>
);

export default DownloadButton;
