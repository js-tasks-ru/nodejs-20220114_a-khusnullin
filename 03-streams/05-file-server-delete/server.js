const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':

       //Step 1. Delete file + callback for errors
      fs.unlink(filepath, (error) => {
        if (error){
          if (error.code === "ENOENT"){
            //Step 2.1 Check nested folders. If request of nested folders => err 400, else 404
            const dirCheck = pathname.split("/");
            if (dirCheck.length > 1){
              res.statusCode = 400;
              res.end("Bad request - request of nested folder");
            } else {
              res.statusCode = 404;
              res.end("Not Found - File doesn't exist");
            }
          } else {
            //Step 2.2 Otherwise throw err 500
            res.statusCode = 500;
            res.end("Internal server error")
          }
        } else {
          res.statusCode = 200;
          res.end("File deleted");
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
