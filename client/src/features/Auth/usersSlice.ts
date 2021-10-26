import dotenv from 'dotenv';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { createHmac } from 'crypto';
dotenv.config();


interface IUser {
    id?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: string;
    exp?: number;
    iat?: number;
}

interface IUserState {
    user: IUser,
    status: string,
    token: string,
}

const initialState: IUserState = {
    user: {},
    status: '',
    token: '',
}

interface IRegistration {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role?: string,
}

export const registration = createAsyncThunk(
    'user/registration',
    async (data: IRegistration) => {
        data.password = await createHmac('sha256', data.password)
            .update('pass').digest('hex');
        data.role = 'user';
        try {
            return await axios.post(`http://localhost:5000/api/auth/registration`, data)
                .then((response: AxiosResponse) => console.log(response.data))
        } catch (error) {
            console.log(error)
        }
    }
);

interface ILogin {
    email: string,
    password: string,
}
interface ILoginResponse {
    token?: string
    message?: string
}
export const login = createAsyncThunk(
    'user/login',
    async (data: ILogin) => {
        data.password = await createHmac('sha256', data.password)
            .update('pass').digest('hex');
        try {
            return await axios.post(`http://localhost:5000/api/auth/login`, data)
                .then((response: AxiosResponse) => response.data as ILoginResponse)
                .then((data: ILoginResponse): string | undefined => {

                    if (data.token) return String(data.token)
                    if (data.message) return String(data.message);
                })
        } catch (error) {
            console.log(error)
        }
    }
);


export const verify = createAsyncThunk(
    'user/verify',
    async (data: string | null) => {
        try {
            return await axios.post<IUser>(`http://localhost:5000/api/auth/privat`, data, {
                headers: {
                    'Authorization': `Bearer ${data}`
                }
            })
                .then((response: AxiosResponse) => response.data)


        } catch (error) {
            console.log(error)
        }
    }
);


const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        removeToken(state, action) {
            state.token = action.payload;
        },
        updateToken(state, action) {
            state.token = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(registration.pending, (state) => { state.status = 'loading'; })
            .addCase(registration.fulfilled, (state, { payload }) => {

            })
            .addCase(registration.rejected, () => { });
        ///////
        builder
            .addCase(login.pending, (state) => { state.status = 'Please enter your email and password.' })
            .addCase(login.fulfilled, (state, { payload }) => {
                if (typeof payload !== 'string') return
                if (payload.length < 20) state.status = payload;
                if (payload.length > 20) {
                    localStorage.setItem('token', payload);
                    state.token = payload
                }
            })
            .addCase(login.rejected, () => { });
        builder
            .addCase(verify.pending, (state) => { })
            .addCase(verify.fulfilled, (state, { payload }) => {
                console.log(payload)
                state.user = payload as IUser;
            })
            .addCase(verify.rejected, () => { });
    }
});

export const { removeToken, updateToken } = usersSlice.actions;





export default usersSlice.reducer;