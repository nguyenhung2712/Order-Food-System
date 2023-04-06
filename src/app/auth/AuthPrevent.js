import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    let { isAuthenticated } = useAuth();
    const { pathname } = useLocation();
    return (
        <>
            {
                !isAuthenticated 
                ? ( children ) 
                : ( <Navigate replace to="/" state={{ from: pathname }} /> )
            }
        </>
    );
};

export default AuthGuard;
