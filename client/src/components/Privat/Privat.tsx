import { FC, useEffect } from 'react';
import {useAppDispatch} from '../../features/store';
import { verify } from '../../features/Auth/usersSlice';


const Privat: FC = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(verify(localStorage.getItem('token')))
    }, [dispatch])


    return (
        <div>
            Privat


        </div>
    );
};

export default Privat;