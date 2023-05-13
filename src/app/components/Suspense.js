import { MatxLoading } from '.';
import { Suspense } from 'react';
import React from 'react';

const SuspenseCustom = ({ children }) => {
    return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
};

export default SuspenseCustom;
