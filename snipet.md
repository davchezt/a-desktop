## UPLOAD base64
```js
var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");

require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
  console.log(err);
});
```

## encode MIME base64
```js
function base64MimeType(encoded) {
  var result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}

var encoded = 'data:image/png;base64,iVBORw0KGgoAA...5CYII=';
console.log(base64Mime(encoded)); // "image/png"
```

## JIMP
```js
const base64str = "R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="//base64 of a 1x1 black pixel
const buf = Buffer.from(base64str, 'base64');

jimp.read(buf, (err, image) => {
  if (err) throw err;
  else {
    image.crop(140, 50, 200, 280)
    .quality(100)
    .getBase64(jimp.MIME_JPEG, function (err, src) {
      console.log("rb is \n")
      console.log(src);
    });
  }
});
```