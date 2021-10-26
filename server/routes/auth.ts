import express from 'express';
const router = express.Router();
import {
    registration,
    login,
    verify,
} from '../controllers/auth';

router.post('/registration', registration);
router.post('/login', login);

router.post('/privat*', verify, (req: any, res) => {
    res.status(200).json(req.user)
})




export default router;