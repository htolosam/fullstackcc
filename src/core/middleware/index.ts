import * as jwt from 'jsonwebtoken'
import moment = require('moment')

import { Config } from '../../config'

const auth = async(req: any, res: any, next: any) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const data : any = jwt.verify(token, Config.jwtSecret)
        const expirationDate = moment(new Date(data['expirationDate']))        
        const nowDate = moment(Date.now())
        if(expirationDate.isBefore(nowDate)){
            res.status(401).send({ error: "Token invalido"})
        }
        next();
    } catch(err){
        res.status(403).send({ message: 'No autorizado'})
    }
}

export { auth }