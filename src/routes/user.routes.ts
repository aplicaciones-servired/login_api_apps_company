import { createUser, loginUser, logoutUser, UserByToken, findAllUsers, findUserById, forgotPassword, resetPassword } from '../controllers/user.controllers'
import { Router } from 'express';

export const userRouter = Router();

userRouter.post('/register', createUser)

userRouter.post('/login', loginUser)

userRouter.get('/profile', UserByToken)

userRouter.post('/logout', logoutUser)

userRouter.get('/users', findAllUsers)

userRouter.get('/user/:id', findUserById)

userRouter.post('/auth/forgot-password', forgotPassword)

userRouter.post('/auth/reset-password', resetPassword)
