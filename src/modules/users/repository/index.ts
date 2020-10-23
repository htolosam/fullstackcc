import { UserRepository } from './user.repository'

import { models } from '../../../core'

// Inject Models
const userRepository = new UserRepository(models)

export {
    userRepository,
}