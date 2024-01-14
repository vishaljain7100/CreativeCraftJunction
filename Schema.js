const Joi = require("joi")


module.exports = {
    listing: Joi.object({
        title: Joi.string().required().min(3).max(20),
        description: Joi.string().required().min(5).max(100),
        price: Joi.number().required(),
        productId: Joi.string().required(),
        categoryId: Joi.number().required(),
        categoryName: Joi.string().required()
    }).required(),

    user: Joi.object({
        username:Joi.string().required(),
        ContactNumber: Joi.number().required(),
        email: Joi.string().required(),
    }).required(),

    categorySchema: Joi.object({
        categoryName: Joi.string().required(),
        categoryId: Joi.number().required()
    }).required()
}
