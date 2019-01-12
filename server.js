/**
 * ngal:
 * This will read the current folder's file list and get only image
 * files(png and jpg). It then generates an html page with those images
 * as a gallery.
 *
 * Run this as
 * $ cd path/to/image/folder
 * $ node server.js 3010
 *
 */

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const PORT = process.argv[2] || 3030;

// as of now make sure the images are jpeg or png
const mimeTypeMap = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".html": "text/html"
};

const buildHTML = () => {
  // get list of files that are png and jpg
  // the map fn is used to convert spaces to %20
  const images = fs
    .readdirSync(__dirname)
    .filter(fileName => fileName.endsWith(".jpg") || fileName.endsWith(".png"))
    .map(fileName => encodeURI(fileName));

  let imageLinks = "";

  /* 
  we need a set of elements that look like
   <a href="x.png">
    <figure>
      <img src="x.png" alt="x.png" />
    </figure>
   </a>
  */
  if (images.length < 1) {
    imageLinks = "<h1>No images in directory</h1>";
  } else {
    imageLinks = images
      .map(
        image => `<a href="${image}">
<figure><img src="${image}" alt="${image}" /></figure>
</a href="${image}">`
      )
      .join("");
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>ngal: A simple image gallery</title>
  <style>
    div {
      display: flex;
      flex-wrap: wrap;
    }
    img {
      width: 150px;
      height: 150px;
    }
  </style>
</head>
<body>
  <div>
  ${imageLinks}
  </div>
</body>
</html>
`;

  return html;
};

// -- server - start
const server = http.createServer((req, res) => {
  // silly logging
  console.log(`${new Date().toISOString()} - ${req.method} - ${req.url}`);

  // only GET method is allowed
  const method = req.method.toLowerCase();
  if (method !== "get") {
    res.statusCode = 405;
    res.end(`Bad method`);
    return;
  }

  // get url
  const parsedUrl = url.parse(req.url, true);

  // Get the path and extension
  let pathName = parsedUrl.pathname;
  const trimmedPathName = pathName.replace(/^\/+|\/+$/g, "");
  const ext = path.parse(pathName).ext;

  // if the route is /, give back index.html
  if (trimmedPathName === "") {
    // build html
    const html = buildHTML();
    res.statusCode = 200;
    res.setHeader("Content-type", mimeTypeMap[".html"]);
    res.end(html);
    return;
  }

  // to search the folder, we need a '.' at the start
  // so /x.png becomes ./x.png
  pathName = `.${pathName}`;
  // if the filename has spaces, we'll get a %20,
  // convert that back to a space
  pathName = decodeURI(pathName);

  // -- check file exists - start
  fs.exists(pathName, exist => {
    if (!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`${pathName} not found!`);
      return;
    }

    // -- get file - start
    fs.readFile(pathName, (err, data) => {
      if (err) {
        // if we cant read the file, return 500
        res.statusCode = 500;
        res.end(err);
      } else {
        res.statusCode = 200;
        res.setHeader("Content-type", mimeTypeMap[ext]);
        res.end(data);
      }
    });
    // -- get file - end
  });
  // -- check file exists - end
});
// -- server - end

server.listen(parseInt(PORT), () => {
  console.log(`[server] listening on PORT ${PORT}`);
});
