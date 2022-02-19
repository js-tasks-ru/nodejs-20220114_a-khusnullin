const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const product = require('../mappers/product');

module.exports.checkout = async function checkout(ctx, next) {
    //If user is not authorized throw error 401
    if (!ctx.request.header.authorization) {
        ctx.throw(401, "Пользователь не авторизован");
    }
    //Cart to prepare order
    const cart = ctx.request.body;
    //Create order in DB
    const order = await Order.create({
        user: ctx.user._id,
        product: cart.product,
        phone: cart.phone,
        address: cart.address,
    });
    //Return Order ID
    ctx.body = {order: order._id};
    
    //Send confiramtion via e-mail
    await sendMail({
        template: 'confirmation',
        locals: {
            id: order.id,
            product: order.product,
        },
        to: ctx.user.email,
        subject: 'Подтверждение заказа',
    });

    return next();

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    //If user is not authorized throw error 401
    if (!ctx.request.header.authorization) {
        ctx.throw(401, "Пользователь не авторизован");
    }
    //Find orders in DB
    const orders = await Order.find({user: ctx.user._id}).populate('product');
    
    //Return orders in response body
    ctx.body = {orders: orders};
    return next();
};
