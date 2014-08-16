FullScreenMario
===============

*This is a forked version of FullScreenMario that radically changes Things, Maps and local data. Not all functionality has been copied over, and many maps are missing key features. Once it has completely made up the features from the main branch, it will be merged back into the project.*

An HTML5 remake of the original Super Mario Brothers - expanded for modern browsing.

------------------------------------------------------------------------------------

## How to Play

Due to a legal complaint from Nintendo, this project is no longer directly available via www.fullscreenmario.com.
However, you may run or host your own copies of the game on your computer, a cloud IDE, or your own server.

### Your Computer (Local)

Download and extract the project .zip, and open index.html in a browser. That's it!

### Your Computer (Virtual Host)

Download and install the <a href='http://www.apachefriends.org/en/xampp.html'>*AMP stack</a> suitable for your operating system.
Download the FullScreenMario .zip, and extract the files in a directory somewhere under htdocs. You'll be able to access it via http://localhost/ in your browser.

* For example, placing the files in C:/xampp/htdocs/FSM/ will translate to http://localhost/FSM/

### Cloud IDE

[![IDE](https://codio-public.s3.amazonaws.com/sharing/demo-in-ide.png)](https://codio.com/p/create/?from_github=Diogenesthecynic/FullScreenMario-JSON)

* Select `Preview > Project Index`.
* Select `Preview > New Browser Tab`.
* Click `Preview` and then click inside the game area.

### Your Server

Follow the same steps as running on your computer (virtual host), but onto your server's file storage (you'll likely need to FTP the files over).


## Developers & Legal

This is released under the <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Attribution Non-Commercial Share-Alike</a> license. Full Screen Mario is meant to be both a proof of concept and an entertaining pasttime, not a source of income</a>.

The whole project was originally hosted under www.fullscreenmario.com, but that site was taken down by Nintendo for copyright infringement.

### Using Your Own Sprites

Please do! Sprites are stored in /settings/sprites.js. They're compressed into a custom text-based format that's documented in /src/PixelRender/README.md: you'll want to read that to see how to make your own. 