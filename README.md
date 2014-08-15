FullScreenMario
===============

*This is a forked version of FullScreenMario that radically changes Things, Maps and local data. Not all functionality has been copied over, and many maps are missing key features. Once it has completely made up the features from the main branch, it will be merged back into the project.*

An HTML5 remake of the original Super Mario Brothers - expanded for modern browsing.

------------------------------------------------------------------------------------

## How to Play

Due to a legal complaint from Nintendo, this project is no longer directly available via www.fullscreenmario.com.
However, you may run or host your own copies of the game on your computer, a cloud IDE, or your own server.

### Your Computer (Local)

You may run the game through the helper UI via index.html, or directly via mario.html.
This will run an entirely local copy of the game (note that via index.html, for security reasons, Chrome may not 
allow you to access the game through the Javascript console).

### Your Computer (Virtual Host)

Download and install the <a href='http://www.apachefriends.org/en/xampp.html'>*AMP stack</a> suitable for your operating system.
Place Full Screen Mario's files in a directory somewhere under htdocs, and access it via localhost in your browser.

* For example, htdocs/FSM/index.html will translate to http://localhost/FSM/

Because your browser will allow AJAX requests via a server, delete the "This is an offline copy..." log message
from maps.js, along with all subsequent functions (they will be loaded over-eagerly by the game).

### Cloud IDE

[![IDE](https://codio-public.s3.amazonaws.com/sharing/demo-in-ide.png)](https://codio.com/p/create/?from_github=Diogenesthecynic/FullScreenMario-JSON)

* Select `Preview > Project Index`.
* Select `Preview > New Browser Tab`.
* Click `Preview` and then click inside the game area.

### Your Server

Follow the same steps as running on your computer (virtual host). 


## Developers & Legal

This is released under the <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Attribution Non-Commercial Share-Alike</a> license. Full Screen Mario is meant to be both a proof of concept and an entertaining pasttime, not a source of income</a>.

The whole project was originally hosted under www.fullscreenmario.com, but that site was taken down by Nintendo for copyright infringement.
