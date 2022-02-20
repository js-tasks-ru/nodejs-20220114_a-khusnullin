module.exports = function mustBeAuthenticated(ctx, next) {
  //If session is absent in headers => return Error 401
  session = ctx.request.get('Authorization');
  if (!session){
    let error401 = new Error("Пользователь не залогинен");
    error401.status = 401;
    throw error401;
  }
  return next();
};
