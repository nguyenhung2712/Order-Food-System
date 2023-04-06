import useAuth from '../hooks/useAuth';
import { flat } from '../utils/utils';
import { Navigate, useLocation } from 'react-router-dom';
import AllPages from '../routes';

const userHasPermission = (pathname, user, routes) => {
    if (pathname.split("/").some(char => char.length === 36)) {
        const pathParts = pathname.split("/").filter(char => char.length !== 36  && char !== "");
        pathname = pathParts.reduce((acc, part) => {
            return acc + "/" + part;
        }, "") + "/:id";
    }
    const matched = routes.find((r) => r.path === pathname);
    
    if (!user) {
        return false;
    }
    if (!matched.auth) {
        return true;
    } else {
        return matched.auth.every(role => user.roles.map(role => role.name).includes(role));
    }
};

const AuthGuard = ({ children }) => {
    let { isAuthenticated } = useAuth();
    const { pathname } = useLocation();
    let user = JSON.parse(localStorage.getItem('user'));
    const routes = flat(AllPages);

    const authorizated = userHasPermission(pathname, user, routes);
    const authenticated = isAuthenticated;
    
    const Layout = ({authorizated, authenticated}) => {
        if (authorizated && authenticated) {
            return children;
        } else if (!authorizated && authenticated) {
            return <Navigate replace to="/unauthorized" state={{ from: pathname }} />;
        } else if (!authenticated) {
            return <Navigate replace to="/auth/login" state={{ from: pathname }} />;
        }
    }

    return (
        <Layout
            authorizated={authorizated}
            authenticated={authenticated}
        />
    );
};

export default AuthGuard;
