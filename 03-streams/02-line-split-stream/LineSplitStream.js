const stream = require('stream');
const os = require('os');
const { nonVisualElements } = require('juice');

/**
 * Class receives text data returns data line by line
 * @class LineSplitStream
 * @extends stream.Transform
 */

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    /* 
    Temporary Array and String are used
    */
    this.tmpArr = [];
    this.tmpStr = "";
  }

  _transform(chunk, encoding, callback) {
    //Step 1. Add chunk to the temporary String
    this.tmpStr += chunk.toString(this.encoding);
    /* 
    Step 2. Check os.EOL in the temporary string using "match"
    Step 3. If the temporary string contains os.EOL, split the temporary string into the temporary array
    Step 4. Push all elements of the temporary array to the LineSplitStream except the last one
    Step 5. The last item of the temporary array becomes the temporary string.
    Step 6. Cleat the temporary array 
    */
    if (this.tmpStr.match(os.EOL) !== null){
      this.tmpArr = this.tmpStr.split(os.EOL);
      this.tmpArr.forEach((item, index) => {
        if (index !== (this.tmpArr.length - 1)){
          this.push(item);
        } else {
          this.tmpStr = item;
          this.tmpArr = [];
        }
      });
    }
    //Step 7 callback();
    callback();
  }

  _flush(callback) {
    /* 
    Step 8. Push the temporary string to the LineSplitStream
    Step 9. Clear the temporary string
    */
    this.push(this.tmpStr);
    this.tmpStr = "";
    /*
    Step 10. Dev-mod-only. Check that temporary elements are clear
    */
    console.log(`tmpArr: "${this.tmpArr}";${os.EOL}tmpStr: ${this.tmpStr};`);
    callback();
  }
}

module.exports = LineSplitStream;
