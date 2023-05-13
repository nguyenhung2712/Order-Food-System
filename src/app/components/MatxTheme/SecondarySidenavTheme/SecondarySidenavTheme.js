import { ThemeProvider } from '@mui/material';
import React from 'react';

const SecondarySidenavTheme = ({ theme, classes, children, open }) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default SecondarySidenavTheme;
