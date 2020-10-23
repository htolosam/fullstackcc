import express from 'express'

import { Config } from '../../config'
import { router } from './api/v1';

import { connectDb } from '../../core'

let app = express()

app.set('port', Config.port)


// Cors and Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-API-KEY, X-Requested-Width, Accept, Access-Control-Alow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Allow', 'GET, POST, PUT, DELETE')
    next()
})

// Set express
app.use(express.json())

// Set router to express
app.use('/api', router)

// Init app
connectDb().then(async () => {
    app.listen(app.get('port'), () => 
        console.log(`Api escuchando puerto ${app.get('port')}`)
    )
}).catch((e: any) => {
    console.log(e)
})



export { app }