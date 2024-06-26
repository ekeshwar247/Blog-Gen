import React, { useState, useEffect, useContext } from 'react';

import { TextField, Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

// const Component = styled(Box)`
//     width: 400px;
//     margin: auto;
//     box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
// `;

// const Image = styled('img')({
//     height: 80,
//     width: 320,
//     display: 'flex',
//     margin: 'auto',
//     padding: '50px 0 0'
// });

// const Wrapper = styled(Box)`
//     padding: 25px 35px;
//     display: flex;
//     flex: 1;
//     overflow: auto;
//     flex-direction: column;
//     & > div, & > button, & > p {
//         margin-top: 20px;
//     }
// `;

// const LoginButton = styled(Button)`
//     text-transform: none;
//     background: #FB641B;
//     color: #fff;
//     height: 48px;
//     border-radius: 2px;
// `;

// const SignupButton = styled(Button)`
//     text-transform: none;
//     background: #fff;
//     color: #2874f0;
//     height: 48px;
//     border-radius: 2px;
//     box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
// `;

// const Text = styled(Typography)`
//     color: #878787;
//     font-size: 12px;
// `;

// const Error = styled(Typography)`
//     font-size: 10px;
//     color: #ff6161;
//     line-height: 0;
//     margin-top: 10px;
//     font-weight: 600;
// `;

const Component = styled(Box)`
    width: 450px;
    margin: 30px auto;
    box-shadow: 0px 4px 8px 2px rgb(50 50 93 / 0.1), 0px 1px 4px 0px rgb(0 0 0 / 0.1);
    border-radius: 10px;
    background-color: #ffffff;
    padding: 20px;
`;

const Image = styled('img')({
    height: 100,
    width: 300,
    display: 'flex',
    margin: '20px auto',
    padding: '20px 0',
    borderRadius: '5px',
});

const Wrapper = styled(Box)`
    padding: 20px 30px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    background: #ffebcd;
    & > div, & > button, & > p {
        margin-top: 15px;
    }
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: #1976d2;
    color: #ffffff;
    height: 45px;
    border-radius: 5px;
    font-size: 16px;
    &:hover {
        background: #1565c0;
    }
`;

const SignupButton = styled(Button)`
    text-transform: none;
    background: #ffffff;
    color: #1976d2;
    height: 45px;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 15%);
    &:hover {
        background: #f1f1f1;
    }
`;

const Text = styled(Typography)`
    color: #6c757;
    font-size: 14px;
`;

const Error = styled(Typography)`
    font-size: 12px;
    color: #d32f2f;
    line-height: 1.5;
    margin-top: 8px;
    font-weight: 500;
`;

const Background = styled(Box)`
    background: linear-gradient(135deg, #f3ec78, #af4261);
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;


const loginInitialValues = {
    username: '',
    password: ''
};

const signupInitialValues = {
    name: '',
    username: '',
    password: '',
};

const Login = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState(loginInitialValues);
    const [signup, setSignup] = useState(signupInitialValues);
    const [error, showError] = useState('');
    const [account, toggleAccount] = useState('login');

    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);

    const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png';

    useEffect(() => {
        showError(false);
    }, [login])

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }

    const loginUser = async () => {
        let response = await API.userLogin(login);
        if (response.isSuccess) {
            showError('');

            sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
            sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
            setAccount({ name: response.data.name, username: response.data.username });
            
            isUserAuthenticated(true)
            setLogin(loginInitialValues);
            navigate('/');
        } else {
            showError('Something went wrong! please try again later');
        }
    }

    const signupUser = async () => {
        let response = await API.userSignup(signup);
        if (response.isSuccess) {
            showError('');
            setSignup(signupInitialValues);
            toggleAccount('login');
        } else {
            showError('Something went wrong! please try again later');
        }
    }

    const toggleSignup = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
    }

    return (
        <Background>
        <Component>
            <Box>
                <Image src={ require('./logo.jpg') } />
                {
                    account === 'login' ?
                        <Wrapper>
                            <TextField variant="standard" value={login.username} onChange={(e) => onValueChange(e)} name='username' label='EEEnter Username' />
                            <TextField variant="standard" value={login.password} onChange={(e) => onValueChange(e)} name='password' label='Enter Password' />

                            {error && <Error>{error}</Error>}

                            <LoginButton variant="contained" onClick={() => loginUser()} >Login</LoginButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SignupButton onClick={() => toggleSignup()} style={{ marginBottom: 50 }}>Create an account</SignupButton>
                        </Wrapper> :
                        <Wrapper>
                            <TextField variant="standard" value={signup.name} onChange={(e) => onInputChange(e)} name='name' label='Enter Name' />
                            <TextField variant="standard" value={signup.username} onChange={(e) => onInputChange(e)} name='username' label='Enter Username' />
                            <TextField variant="standard" value={signup.password} onChange={(e) => onInputChange(e)} name='password' label='Enter Password' />

                            <SignupButton onClick={() => signupUser()} >Signup</SignupButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <LoginButton variant="contained" onClick={() => toggleSignup()}>Already have an account</LoginButton>
                        </Wrapper>
                }
            </Box>
        </Component>
        </Background>
    )
}

export default Login;
