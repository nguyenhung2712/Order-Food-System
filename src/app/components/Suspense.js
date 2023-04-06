import { MatxLoading } from '.';
import { Suspense } from 'react';

const SuspenseCustom = ({ children }) => {
  return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
};

export default SuspenseCustom;
