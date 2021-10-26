import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { login } from '../../../features/Auth/usersSlice';
import { useAppDispatch, useAppSelector, RootState } from '../../../features/store';
import { useHistory } from 'react-router-dom';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';


const RegistrationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    height: auto;
    padding-top: 100px;
    padding-bottom: 100px;
`;

const Form = styled.form`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 300px
`;
const InputText = styled.input`
    padding: 5px;
    margin-top: 5px;
    outline: none;
    border-radius: 4px;
    &:nth-child(4) {
        margin-bottom: 5px;
    }
    &:nth-child(5) {
        align-self: center;
        width: 50%;
        border: none;
        background-color: transparent;
        box-shadow: 1px 1px 5px silver;
        cursor: pointer
    }
`;

interface IFormDataLogin {
    email: string,
    password: string,
}

const Login: FC = () => {

    const history = useHistory();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state: RootState) => state.users.token);
    const status = useAppSelector((state: RootState) => state.users.status);
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: IFormDataLogin) => {
        dispatch(login(data));
    }

    useEffect(() => {
        if (token.length === 0) return
        history.push('/privat')
    }, [token, history])


    return (
        <RegistrationWrapper>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <InputText type='text' {...register('email', { required: true })} />
                <InputText type='text' {...register('password', { required: true })} />
                <InputText type='submit' value='Sign In' />
            </Form>
            <ErrorMessage status={status}/>
        </RegistrationWrapper>
    );
};

export default Login;