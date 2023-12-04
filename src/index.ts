import express from 'express'
import cookieParser from 'cookie-parser'
import { port, url } from './config'
import cors, { CorsOptions } from 'cors'
import logger from './utils/logger'
import database from './service/database.service'
import errorHandler from './middlewares/error'
import { graphqlHTTP} from 'express-graphql'
import schema from './schema/schema'


const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(cors({
    credentials: true
}))

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}));
app.use(errorHandler)


app.listen(port, async () => {
    try {
      await database();
      logger.info(`server is running on ${url}`);
    } catch (error) {
      logger.error(error);
    }
  });
