import { combineReducers } from 'redux';
/* import EcommerceReducer from './EcommerceReducer';
import NavigationReducer from './NavigationReducer';
import NotificationReducer from './NotificationReducer'; */
import { authReducer } from './AuthReducer';
import ProductReducer from './ProductReducer';
import BlogReducer from './BlogReducer';
import StaffReducer from './StaffReducer';

const RootReducer = combineReducers({
    auth: authReducer,
    products: ProductReducer,
    blogs: BlogReducer,
    staffs: StaffReducer,
    /* notifications: NotificationReducer,
    navigations: NavigationReducer,
    ecommerce: EcommerceReducer, */
});

export default RootReducer;
