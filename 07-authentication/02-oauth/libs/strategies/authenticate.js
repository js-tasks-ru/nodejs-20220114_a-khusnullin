const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  console.log(strategy, email, displayName);
  try {
      //Step 1 - Chck email in passport 
    if (!email) {
      return done(null, false, 'Не указан email');
    }
    //Step 2 - Check email validity
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(email) === false){
      throw new ValidationError("Некорректный email.");
    }
    //Step 3 - Search user in DB.
    const user = await User.findOne({email});
    //Step 4 - If User exists return user data
    if (user) {
      done(null, user);
    } else {
      //Step 5 - If User doesn't exist - create new User
      const u = new User({"email": email, "displayName": displayName});
      await u.save();
      const newUser = await User.findOne({email});
      done(null, newUser);
    }
  } catch (err) {
    console.log(`${err.name}: ${err.message}`);
    done(err);
  }
};

class ValidationError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "ValidationError"; // (2)
    //this.errors.email.message = "Некорректный email.";
  }
}
