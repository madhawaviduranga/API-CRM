import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import userModel from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcrypt';

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}
	// 2) Check if user exists && password is correct
	const user = await userModel.findByEmail(email);

	if (!user || !(await bcrypt.compare(password, user.password_hash))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// 3) If everything ok, send token to client
	const token = signToken(user.user_id);

	res.status(200).json({
		status: 'success',
		token
	});
};

export const protect = async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('You are not logged in. Please log in to get access.', 401));
	}

	try {
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		const currentUser = await userModel.getById(decoded.id);

		if (!currentUser) {
			return next(new AppError('The user belonging to this token no longer exists.', 401));
		}

		req.user = currentUser;
		next();
	} catch (error) {
		next(new AppError('Invalid token. Please log in again.', 401));
	}
};

export const restrictTo = (...permissions) => {
	return async (req, res, next) => {
		try {
			const userPermissions = await userModel.getPermissions(req.user.user_id);
			const hasPermission = permissions.some(p => userPermissions.includes(p));
			if (!hasPermission) {
				return next(new AppError('You do not have permission to perform this action', 403));
			}
			next();
		} catch (error) {
			next(new AppError('Error checking permissions.', 500));
		}
	};
};
