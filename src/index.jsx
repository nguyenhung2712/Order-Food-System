import { CssBaseline } from '@mui/material';
import { StyledEngineProvider } from '@mui/styled-engine';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { Store } from './app/redux/Store';
import setupInterceptors from './app/services/InterceptorAxios';

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <BrowserRouter>
            <CssBaseline />
            <App />
        </BrowserRouter>
    </StyledEngineProvider>,
    document.getElementById('root')
);

setupInterceptors(Store);