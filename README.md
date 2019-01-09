# ngal 🖼️

ngal is a simple html gallery generator written in Nodejs. It uses flexbox for the grid. This was born out of my need to host my own [unixporn](https://www.reddit.com/r/unixporn/).

## How does it work? 🔧

```bash
$ cd /path/to/images
$ cp ~/Downloads/ngal/server.js .
$ node server.js 1337
```

1. Looks for `.png` and `.jpg` files in `$CURRENT_DIR`.
2. Generates an HTML page with links to those files as a gallery.
3. Serves that page over a request on `/`.

## How does it look like? 👀

It's boring, but here's screenshot if you must.

![ngal](https://www.aktsbot.in/pub/scrots/20190110_0035.png)

## References 📖

- [this](https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs), [this](https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http) and [this](https://nodejs.org/api/net.html) - yes it's all stackoverflow 🙄

## License 🛡️

[WTFPL](http://www.wtfpl.net/)
