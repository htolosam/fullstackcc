import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import moment = require('moment')

import { Config } from '../../../config'
import { LoginUserDto } from '../dtos'

// Error handleing
import { Either, GenericAppError, Result, left, right } from '../../../core'
import { UserErrors } from './user.repository.error'
type Response = Either<
    GenericAppError.UnexpectedError |
    GenericAppError.NotFoundError |
    UserErrors.AccountAlreadExists | 
    UserErrors.AccountDoesNotExists |
    UserErrors.PasswordNotMatch |
    UserErrors.InvalidUser |
    Result<any>,
    Result<void>>


export interface IUserRepo {
    create(user: LoginUserDto): Promise<Response>
    login(userLogin: LoginUserDto): Promise<Response>
    toogleActive(email: string): Promise<Response>
    //changePassword(userLogin: LoginUserDto): Promise<Response>
}

export class UserRepository implements IUserRepo {
    
    private models: any

    constructor(models){
        this.models = models
    }

    
    
    public async create(user: LoginUserDto): Promise<Response> {
        const newUser = this.models.User;
        try{
            const id =  await newUser.schema.methods.CreateUser(user)
            return right(Result.ok<any>(id)) as Response
        } catch(e){
            return left(new GenericAppError.UnexpectedError(e)) as Response
        }
    }


    async login(userLogin: LoginUserDto): Promise<Response> {    
        try{
            const exist = await this.exists(userLogin.email)
            if(exist){
                return this.getToken(userLogin)
            } else {
                return left(new UserErrors.AccountDoesNotExists(userLogin.email)) as Response
            }
        } catch(e){
            return left(new GenericAppError.UnexpectedError(e)) as Response
        }
    }

    private async exists(email): Promise<boolean> {
        var query = { email: { $regex: new RegExp(`^${email.toLowerCase()}`,'i')} }
        const user = await this.models.User.findOne(query)
        return !!user === true
    }

    private async getToken(userLogin: LoginUserDto) : Promise<Response>{
        var query = { email: { $regex: new RegExp(`^${userLogin.email.toLowerCase()}`,'i')} }
        const user = await this.models.User.findOne(query)
        const isPaswordMatch = await bcrypt.compare(userLogin.password, user['password'])
        if(isPaswordMatch){
            const expirationDate = moment(Date.now()).add(5,'m')
            const token = jwt.sign({
                email: userLogin.email,
                expirationDate: expirationDate            
            }, Config.jwtSecret)
            return right(Result.ok<any>({token: token})) as Response
        } else {
            return left(new UserErrors.PasswordNotMatch()) as Response
        }
    }

    public async toogleActive(email: string): Promise<Response> {
        try{
            console.log('repository: ' + email);
            const exist = await this.exists(email);
            if(exist){
                const newUser = this.models.User;
                const resp = newUser.schema.methods.ToogleActive(email);
                console.log('resp en user.repository: ' + resp);
                let response = (resp == true ? 'Se activo el usuario' : 'Se inactivo el user');

                return right(Result.ok<any>({message: response})) as Response
            } else {
                return left(new UserErrors.AccountDoesNotExists(email)) as Response
            }
        } catch(e){
            return left(new GenericAppError.UnexpectedError(e)) as Response
        }
    }

    /*changePassword(userLogin: LoginUserDto): Promise<Response> {
        return left(new GenericAppError.UnexpectedError(null)) as Response
    }*/
}
