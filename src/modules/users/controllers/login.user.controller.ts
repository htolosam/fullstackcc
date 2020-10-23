import { BaseController } from '../../../core'

import { IUserService, UserService } from '../services/user.service'
import { LoginUserDto } from '../dtos'
import { UserErrors } from '../repository/user.repository.error'

export class LoginUserController extends BaseController {
    
    constructor(private readonly userService: IUserService){
        super()
    }

    async executeImpl(): Promise<any> {
        try {          
            const dto : LoginUserDto = this.req.body as LoginUserDto
            const result = await this.userService.login(dto) as any;      
            if(result.isLeft()){
                const error = result.value
                switch(error.constructor){
                    case UserErrors.AccountDoesNotExists:
                        return this.notFound(error.errorValue().message)
                    case UserErrors.PasswordNotMatch:
                        return this.forbbiden(error.errorValue().message)
                    case UserErrors.InvalidUser:
                        return this.preconditionFailed(error.errorValue().message)
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