const Joi = require ('joi')

const usuariosSchema = Joi.object({
    quantidade: Joi.number(), 
    usuarios: Joi.array().items({
        administrador: Joi.boolean(),
        email: Joi.string(),
        nome: Joi.string(),
        password: Joi.string(),
        _id: Joi.string()
    })
})
export default usuariosSchema;
