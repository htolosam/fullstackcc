import * as express from 'express'

import { userRouter } from '../../../modules'

const router = express.Router()

router.use('/v1',
    userRouter
)

export { router }