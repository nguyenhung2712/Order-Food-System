import { styled } from '@mui/material';
import React from "react";

const Content = styled('div')(() => ({
    flexGrow: 1,
    height: '100%',
    position: 'relative',
}));

const SidenavContent = ({ children }) => {
    return <Content>{children}</Content>;
};

export default SidenavContent;
