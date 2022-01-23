const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

/**
 * The Class counts received data and throws LimitExceededError if the limit is exceeded 
 * @class LimitSizeStream
 * @extends stream.Transform
 */

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    
    this.limit = options.limit;
    this.encoding = options.encoding;

    //The limit counter is used
    this.limitCounter = 0;
  }

  _transform(chunk, encoding, callback) {
    //Step 1. Count data
    this.limitCounter += chunk.length;
    /* 
    Step 2. If limit is exceeded => throw LimitExceededError
    Step 3. If limit is not exceeded => OK, callback
    */
    if (this.limitCounter > this.limit){
      callback(new LimitExceededError());
    } else {
      const str = chunk.toString(this.encoding);
      callback(null, str);
    }
  }
  
}

module.exports = LimitSizeStream;
