const Joi = require("joi")


const post = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().min(3).max(20),
        description: Joi.string().required().min(5).max(100),
        image1: Joi.string().required(),
        image2: Joi.string(),
        image3: Joi.string(),
        price: Joi.number().required(),
        productId: Joi.string().required(),
        categoryId: Joi.number().required(),
        categoryName: Joi.string().required()
    })
})

module.exports = post