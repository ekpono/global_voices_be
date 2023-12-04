import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.PORT || 1000;
export const nodeEnv = process.env.NODE_ENV || 'development';
export const url = process.env.URL || 'localhost:5000';
export const mongoURI = process.env.MONGO_URI;
export const jwtSecret = process.env.JWT_SECRET as string;
export const accessTokenExpiresIn = process.env.ACCESS_TOKEN_LIFE;
export const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_LIFE;
export const expTime = process.env.EXP_TIME || 60000;
