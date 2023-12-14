const Joi = require("joi")


module.exports = {
    listing: Joi.object({
        title: Joi.string().required().min(3).max(20),
        description: Joi.string().required().min(5).max(100),
        image1: Joi.string().required(),
        image2: Joi.string().allow(''),
        image3: Joi.string().allow(''),
        price: Joi.number().required(),
        productId: Joi.string().required(),
        categoryId: Joi.number().required(),
        categoryName: Joi.string().required()
    }).required(),

    userSchema: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        ContactNumber: Joi.number().required()
    }).required(),

    categorySchema: Joi.object({
        categoryName: Joi.string().required(),
        categoryId: Joi.string().required(),
        image: Joi.string().required()
    }).required()
}
