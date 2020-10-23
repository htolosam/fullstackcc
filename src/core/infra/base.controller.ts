import { HttpMessages } from '../constants'
import { writeLog, logType } from '../../logger'

export abstract class BaseController {
    protected req!: any;
    protected res!: any;
    
    protected abstract executeImpl(): Promise<void | any>

    public async execute(req: any, res: any): Promise<void>{
        this.req = req;
        this.res = res;        
        try{
            await this.executeImpl();            
        } catch(err){
            console.log(`${HttpMessages.msj.baseError} - ${req.route.path}`);
            console.log(err)
            writeLog(`${HttpMessages.msj.baseError}`, logType.info);
            writeLog(err, logType.error)
        }
    }

    protected jsonResponse(code: number, message: string){
        return this.res.status(code).json({message})
    }

    protected ok<T>(dto?: T){
        if(!!dto){
            return this.res.status(200).json(dto)
        } else {
            return this.res.status(200).json(true)
        }
    }

    protected badRequest(message?: string){
        return this.jsonResponse(400, message? message : HttpMessages.msj.badRequest)
    }

    protected unauthorized(message?: string){
        return this.jsonResponse(401, message? message : HttpMessages.msj.unAuthorized)
    }

    protected forbbiden(message?: string){
        return this.jsonResponse(403, message? message : HttpMessages.msj.forbidden)
    }

    protected notFound(message?: string){
        return this.jsonResponse(404, message? message : HttpMessages.msj.notFound)
    }

    protected preconditionFailed(message?: string){
        return this.jsonResponse(412, message? message : HttpMessages.msj.preconditionFailed)
    }
    
    protected fail(error: any | string){
        this.log(error);
        return this.res.status(500).json({
            message: error
        })
    }

    private log(error: any | string){
        writeLog(error, logType.error)
    }
}