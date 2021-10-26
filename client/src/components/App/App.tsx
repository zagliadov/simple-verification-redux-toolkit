import { FC, useEffect } from 'react';
import Header from '../Header/Header';
import Registration from '../Auth/Registration/Registration';
import Login from '../Auth/Login/Login';
import { Switch, Route } from 'react-router-dom';
import Home from '../Home/Home';
import styled from 'styled-components';
import Privat from '../Privat/Privat';
import { useAppDispatch } from '../../features/store';
import { updateToken } from '../../features/Auth/usersSlice';
import Dashboard from '../Dashboard/Dashboard';

const Wrapper = styled.div`
    height: 100vh;
    box-sizing: border-box;
`;


const App: FC = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!localStorage.getItem('token')) return 
        dispatch(updateToken(localStorage.getItem('token')))
    }, [dispatch])

    return (
        <Wrapper>
            <Header />
            <Switch>
                <Route path='/' exact>
                    <Home />
                </Route>
                <Route path='/privat' exact>
                    <Privat />
                </Route>
                <Route path="/privat/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/signin">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Registration />
                </Route>
            </Switch>
        </Wrapper>

    );
};

export default App;