const path = require('path');
const Koa = require('koa');
const events = require('events')
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

//Step 1. Create new Event Emitter
const emitter = new events.EventEmitter();

router.get('/subscribe', async (ctx, next) => {
    ctx.type = 'text/plain; charset=utf-8';
    //Step 2. Wait for new Message
    ctx.body = await new Promise((resolve, reject) => {
        emitter.once("newMessage", (message) => resolve(message));
    });
    //Return status 200 & next();
    ctx.status = 200;
    return next();
});

router.post('/publish', async (ctx, next) => {
    /* 
        Step 3. If POST request received & message is NOT empty => emit new Event
        If POST request received & message is empty => do nothing 
    */
    ctx.type = 'text/plain; charset=utf-8';
    if (ctx.request.body.message){
        await new Promise((resolve, reject) => {
            const message = ctx.request.body.message;
            resolve(emitter.emit("newMessage", message));
        });
    }
    //Return status 200 & next();        
    ctx.status = 200;
    return next();
});

app.use(router.routes());

module.exports = app;
