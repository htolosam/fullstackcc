
import { LoginUserDto } from '../dtos'
import { userRepository } from '../repository'

export interface IUserService {
    login(userLogin: LoginUserDto): Promise<any>
    create(user: LoginUserDto): Promise<any>
    toggleActive(email: string): Promise<any>;
}

export class UserService implements IUserService{
    login(userLogin: LoginUserDto): Promise<any> {
        return userRepository.login(userLogin)
    }    
    create(user: LoginUserDto): Promise<any> {
        return userRepository.create(user)
    }

    toggleActive(email: string): Promise<any> {
        console.log('user service toogle: ' + email);
        return userRepository.toogleActive(email);
    }
}
