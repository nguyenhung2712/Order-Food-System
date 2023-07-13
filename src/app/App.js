/* import '../fake-db'; */
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppProvider } from './contexts/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Box, Fab } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { Store } from './redux/Store';
import routes from './routes';
import './App.css';

const App = () => {
    const content = useRoutes(routes);
    /* const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            console.log(1)
            if (window.scrollY > 400) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        });
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }; */

    return (
        <Provider store={Store}>
            <SettingsProvider>
                <MatxTheme>
                    <ToastContainer />
                    <AuthProvider>
                        <AppProvider>
                            {content}
                        </AppProvider>
                    </AuthProvider>
                    {/* {
                        showButton &&
                        <Box sx={{
                            position: "fixed",
                            right: "30px",
                            bottom: "50px",
                            zIndex: 100,
                            transition: "all .15s, ease 0s"
                        }}>
                            <Fab color="primary" aria-label="add">
                                <KeyboardArrowUpIcon />
                            </Fab>
                        </Box>
                    } */}
                </MatxTheme>
            </SettingsProvider>
        </Provider>
    );
};

export default App;
