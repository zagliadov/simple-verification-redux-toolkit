import express from 'express';
import pool from '../db/db';
import jwt from 'jsonwebtoken';
import { QueryResultRow } from 'pg';


interface IRegistrationRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
}

export const registration = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) => {
    try {
        const { firstname, lastname, email, password, role }: IRegistrationRequest = req.body;
        await pool.query(`
            INSERT INTO users (firstname, lastname, email, password, role)
            VALUES('${firstname}','${lastname}', '${email}', '${password}', '${role}')
        `);
        res.status(200).json('success');

    } catch (error) {
        console.log(error)
    }
}

export const verify = async (
    req: any, // Нужно дополнить request
    res: express.Response,
    next: express.NextFunction) => {

    try {
        console.log(req.headers)
        const authHeader: string | undefined = req.headers['authorization'];
        const token: string = String(authHeader) && String(authHeader).split(' ')[1]
        if(token === null) return res.status(401); // Токена нет

        jwt.verify(token, 'secret', (err, user) => {
            if(err) return res.send(403); // Я вижу токен но токен не валидный
            req.user = user;


        })


        next();
    } catch (error) {
        console.log(error)
    }
}

interface ILoginRequest {
    email: string;
    password: string;
}
interface IUserFromDB {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    role: string;
}
export const login = async (
    req: express.Request,
    res: express.Response): Promise<any> => {
    try {
        const { email, password }: ILoginRequest = req.body;

        const user: IUserFromDB = await pool.query(`
            SELECT id, firstname, lastname, email, password, role FROM users
            WHERE email = '${email}'
        `).then((result: QueryResultRow) => result.rows[0]);
        if(!user) return res.status(200).json({message: 'Email incorrect'});
        if(password !== user.password) return res.status(200).json({message: 'Password incorrect'});

        const token: string = jwt.sign({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
        }, 'secret');

        res.status(200).json({token: token});

    } catch (error) {
        console.log(error)
    }
}