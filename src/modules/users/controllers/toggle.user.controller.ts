import { BaseController } from '../../../core'

import { IUserService } from '../services/user.service'
import { UserErrors } from '../repository/user.repository.error'

export class ToggleUserController extends BaseController {
    
    constructor(private readonly userService: IUserService){
        super()
    }

    async executeImpl(): Promise<any> {
        try {          
            const email = this.req.params.email;
            console.log('controller toogle email: ' + email);
            const result = await this.userService.toggleActive(email) as any;
            if(result.isLeft()){
                const error = result.value;
                switch(error.constructor){
                    case UserErrors.AccountDoesNotExists:
                        return this.notFound(error.errorValue().message);
                    default:
                        return this.badRequest(error.errorValue().message)
                }
            } else {
                return this.ok(result.value.getValue())
            }                         
        } catch(error){
            return this.fail(error)
        }
    }    
}
