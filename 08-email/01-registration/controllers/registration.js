const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const Session = require('../models/Session');

module.exports.register = async (ctx, next) => {
    let user = ctx.request.body;
    //Generate verificarion token
    const verificationToken = uuid();
    //Add user to DB
    let newUser = new User({
        email: user.email,
        displayName: user.displayName,
        verificationToken: verificationToken,
    });
    //Generate salt & password hash in DB
    await newUser.setPassword(user.password);
    await newUser.save();
    //Send verification letter via e-mail
    await sendMail({
        template: 'confirmation',
        locals: {token: verificationToken},
        to: user.email,
        subject: 'Подтвердите почту',
    });
    //Return status in response body
    ctx.body = {status: "ok"};
    return next();
};

module.exports.confirm = async (ctx, next) => {

    const token = ctx.request.body.verificationToken;

    let user = await User.findOneAndUpdate({verificationToken: token}, {$unset: {verificationToken: 1}});

    if (!user) {
        ctx.throw(400, "Ссылка подтверждения недействительна или устарела");
    } else {
    
        const sessionToken = uuid();
        await Session.create({
            token: sessionToken,
            lastVisit: new Date(),
            user: user._id,
        });

        ctx.body = {"token": sessionToken};
        return next();
    }
};
