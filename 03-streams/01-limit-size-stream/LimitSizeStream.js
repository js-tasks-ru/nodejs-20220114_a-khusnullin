const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    
/*     console.log(options); */
    
    this.limit = options.limit;
    this.encoding = options.encoding;
    this.limitCounter = 0;
  }

  _transform(chunk, encoding, callback) {
    this.limitCounter += chunk.length;
/*     console.log(this.limitCounter);
    console.log(this.encoding);
    console.log(chunk, chunk.toString(), chunk.toString(this.encoding)); */
    if (this.limitCounter > this.limit){
      callback(new LimitExceededError());
    } else {
      const str = chunk.toString(this.encoding);
      callback(null, str);
    }
  }
  
}

module.exports = LimitSizeStream;
