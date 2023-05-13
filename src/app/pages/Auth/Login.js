import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from '../../components/Typography';
import useAuth from '../../hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import React from 'react';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '32px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}));

const Root = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100% !important',
    '& .card': {
        maxWidth: 800,
        minHeight: 400,
        margin: '1rem',
        display: 'flex',
        borderRadius: 12,
        alignItems: 'center',
    },
}));

// inital login credentials
const initialValues = {
    username: 'jaser2712',
    password: 'hung2712',
    remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Password must be 6 character length')
        .required('Password is required!'),
    username: Yup.string().required('Username is required!'),
});

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { signin } = useAuth();

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {

            await signin(values.username, values.password)
                .then(
                    (value) => {
                        navigate("/");
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <Root>
            <Card className="card" sx={{ justifyContent: "center" }}>
                <Grid container>
                    <Grid item sm={6} xs={12}>
                        <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
                            {/* /assets/images/illustrations/dreamer.svg */}
                            <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
                        </JustifyBox>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <ContentBox>
                            <Formik
                                onSubmit={handleFormSubmit}
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="username"
                                            name="username"
                                            label="Tên đăng nhập"
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.username}
                                            onChange={handleChange}
                                            helperText={touched.username && errors.username}
                                            error={Boolean(errors.username && touched.username)}
                                            sx={{ mb: 3 }}
                                        />

                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="password"
                                            type="password"
                                            label="Mật khẩu"
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.password}
                                            onChange={handleChange}
                                            helperText={touched.password && errors.password}
                                            error={Boolean(errors.password && touched.password)}
                                            sx={{ mb: 1.5 }}
                                        />

                                        <FlexBox justifyContent="space-between">
                                            <FlexBox gap={1}>
                                                <Checkbox
                                                    size="small"
                                                    name="remember"
                                                    onChange={handleChange}
                                                    checked={values.remember}
                                                    sx={{ padding: 0 }}
                                                />

                                                <Paragraph>Nhớ mật khẩu</Paragraph>
                                            </FlexBox>

                                            {/* <NavLink
                                                to="/auth/forgot-pass"
                                                style={{ color: theme.palette.primary.main }}
                                            >
                                                Forgot password?
                                            </NavLink> */}
                                        </FlexBox>

                                        <LoadingButton
                                            type="submit"
                                            color="primary"
                                            loading={loading}
                                            variant="contained"
                                            sx={{ my: 2 }}
                                        > Đăng nhập
                                        </LoadingButton>

                                        <Paragraph>
                                            Bạn chưa có tài khoản?
                                            <NavLink
                                                to="/auth/register"
                                                style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                                            >
                                                Đăng ký
                                            </NavLink>
                                        </Paragraph>
                                    </form>
                                )}
                            </Formik>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </Root>
    );
};

export default Login;
