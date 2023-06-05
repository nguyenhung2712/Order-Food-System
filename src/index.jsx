import { CssBaseline } from '@mui/material';
import { StyledEngineProvider } from '@mui/styled-engine';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { Store } from './app/redux/Store';
import setupInterceptors from './app/services/InterceptorAxios';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <StyledEngineProvider injectFirst>
        <BrowserRouter>
            <CssBaseline />
            <App />
        </BrowserRouter>
    </StyledEngineProvider>
);
if (module.hot) {
    module.hot.accept('./app/App', () => {
        root.render(
            <StyledEngineProvider injectFirst>
                <BrowserRouter>
                    <CssBaseline />
                    <App />
                </BrowserRouter>
            </StyledEngineProvider>
        );
    })
}
setupInterceptors(Store);