import Mongoose from 'mongoose'

import { Config } from '../../config'

// Models
import { User } from './schemas/user'

const connectDb = () => {
    return Mongoose.connect(`${Config.urlDatabase}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .catch((error:any) => console.log({
        description: "Error connection",
        stringConnection: Config.urlDatabase,
        error: error
    }));
}

const models = {
    User
}

export { connectDb, models }