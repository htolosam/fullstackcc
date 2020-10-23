import * as mongose from 'mongoose'
import * as bcrypt from 'bcrypt'
import validator from 'validator'

const userSchema = new mongose.Schema({
    email: {
        type: String,
        required: [true, 'Correo requerido'],
        unique: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: props => 'Email invalido'
        }
    },
    password: {
        type: String,
        required: [true, 'Contraseña requerida']
    },
    mustChangePassword: {
        type: Boolean,
        default: true
    },
    isEmailVerfied: {
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { versionKey: false})


userSchema.pre('save', true, async function(next, done){
    const user = this
    if(user.isNew){
        //TODO: Validar que el usuario no esté registrado
        
        if(!(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(user.get('password')))){
            user.invalidate('password', 'La constaseña no cumple con los requerimientos minimos de seguridad')
            done(new Error('Contraseña invalida'))
        } else {
            const hashPassword = await bcrypt.hash(user.get('password'), 10)
            user.set('password', hashPassword)
        }
    }
    next()
    done()
})

userSchema.methods.CreateUser = async function(raw: any): Promise<any> {
    const user = new User(raw)
    await user.save()
    return user._id
}

userSchema.methods.ToogleActive = async function(email: string): Promise<any> {

    var query = {email: email};
    const user = await User.findOne(query);
    const isActive = user?.get('isActive');
    user?.set('isActive', !isActive);
    await user?.save();
    console.log('database: user: schema retirnando : ' + !isActive);
    return !isActive;
}

userSchema.methods.ChangePassword = async function(email: string, password: string): Promise<any> {
    var query = {email: email};
    const userDb = await User.findOne(query);
    userDb?.set('password', password);
    await userDb?.save();
    return userDb?._id
}


const User = mongose.model('User', userSchema)

export { User }
