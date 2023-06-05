/* import '../fake-db'; */
import { Provider } from 'react-redux';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppProvider } from './contexts/AppContext';
import { ToastContainer, default as cloneElement } from 'react-toastify';

import { Store } from './redux/Store';
import routes from './routes';
import Modal from './components/Modal';
import './App.css';

const App = () => {
    const content = useRoutes(routes);
    return (
        <Provider store={Store}>
            <SettingsProvider>
                <MatxTheme>
                    <AuthProvider>
                        <AppProvider>
                            <Modal />
                            {content}
                            <ToastContainer />
                        </AppProvider>
                    </AuthProvider>
                </MatxTheme>
            </SettingsProvider>
        </Provider>
    );
};

export default App;
