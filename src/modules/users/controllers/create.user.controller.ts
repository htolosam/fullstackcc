import { BaseController } from '../../../core'

import { IUserService, UserService } from '../services/user.service'
import { LoginUserDto } from '../dtos'
import { UserErrors } from '../repository/user.repository.error'

export class CreateUserController extends BaseController {
    
    constructor(private readonly userService: IUserService){
        super()
    }

    async executeImpl(): Promise<any> {
        try {          
            const dto : LoginUserDto = this.req.body as LoginUserDto
            const result = await this.userService.create(dto) as any;      
            if(result.isLeft()){
                const error = result.value
                switch(error.constructor){
                    case UserErrors.AccountDoesNotExists:
                        return this.notFound(error.ErrorValue())
                    case UserErrors.PasswordNotMatch:
                        return this.forbbiden(error.ErrorValue())
                    case UserErrors.InvalidUser:
                        return this.preconditionFailed(error.ErrorValue())
                    default:
                        return this.badRequest(error.ErrorValue())                        
                }
                
            } else {
                return this.ok(result.value.getValue())
            }                         
        } catch(error){
            return this.fail(error)
        }
    }    
}
