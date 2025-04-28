import { authenticateToken } from '../middlewares/authToken';
import { createUser, loginUser, logoutUser, UserByToken, findAllUsers, findUserById, forgotPassword, resetPassword, optionsUser } from '../controllers/user.controllers'
import { Router } from 'express';

export const userRouter = Router();

userRouter.get('/newUserOptions', authenticateToken, optionsUser)

userRouter.post('/register', authenticateToken, createUser)

userRouter.post('/login', loginUser)

userRouter.get('/profile', UserByToken)

userRouter.get('/logout', logoutUser)

userRouter.get('/users', authenticateToken, findAllUsers)

userRouter.get('/user/:id', authenticateToken, findUserById)

userRouter.post('/auth/forgot-password', forgotPassword)

userRouter.post('/auth/reset-password', resetPassword)
