import mongoose from "mongoose";
import { mongoURI } from "../config";
import logger from "../utils/logger";

const database = async() =>{
    try {
        const uri = mongoURI as string
        await mongoose.connect(uri)
        logger.info('database connected successfully!')
    } catch (error) {
        logger.info(error)
    }
}

export default database