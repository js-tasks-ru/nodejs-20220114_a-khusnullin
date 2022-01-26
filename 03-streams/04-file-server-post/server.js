const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      //Step 1. Check that file doesn't exist
      if (fs.existsSync(filepath)){
        res.statusCode = 409;
        res.end();
      } else {
        //Step 2. Check nested folders. If request of nested folders => err 400
        const dirCheck = pathname.split("/");
        if (dirCheck.length > 1){
          res.statusCode = 400;
          res.end("Bad request - request of nested folder");
        }

      //Step 3. Define stream & limitedStream
        const limitedStream = new LimitSizeStream({limit: 1e6, encoding: 'utf-8'});
        const stream = fs.createWriteStream(filepath);

            req
            //Step 4. Pipe for limitedStream
            .pipe(limitedStream)
            //Step 5. Catch limitExceedError and remove file if needed
            .on("error", (err) => {
              if (err){
                if (err.code === 'LIMIT_EXCEEDED'){
                  res.statusCode = 413;
                  fs.unlink(filepath, () => res.end());
                  res.end("Too large file");
                } else {
                  res.statusCode = 500;
                  res.end("Error 500");
                }
              }
            })
            //Step 6. Pipe for stream
            .pipe(stream)
            //Step 7. Catch errors
            .on("error", (err) => {
              if (err.code === "ENOENT"){
                res.statusCode = 404;
                res.end("Error 404");
              } else {
                res.statusCode = 500;
                res.end("Error 500");
              }
            })
            //Step 8. onFinish return status 201
            .on("finish", () => {
              res.statusCode = 201;
              res.end("File file has been successfully saved to the server");
            })
          }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  //Step 9. In case of connection abort destroy the stream
  req.on("aborted", () => {
    fs.unlink(filepath, () => res.end());
  });
});

module.exports = server;
