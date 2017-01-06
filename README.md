Scroll Progress
===============

A small chrome extension showing the scroll progress of current page.

Scroll progress is always displayed at the bottom left.

When is the timing?

- load event
- scroll event

Screenshot
----------

![screenshot](http://i.imgur.com/BG4nZrK.png)

The progress is shown at the lower left corner of the window.

Howto
-----

Open your chrome extensions. `chrome://extensions/`

![howto](http://i.imgur.com/2a9qDaL.png)

Incompatible
------------
- `body` scrollTop() always returns 0.
ex) http://devdocs.io/
This site's `body` is `overflow: auto`.
In other words `body` scroll not work.
Do not run this extention.

Thanks
------

https://github.com/adamzap/scroll-progress

https://github.com/qiao/scroll-progress

License
-------

[MIT License](http://www.opensource.org/licenses/mit-license.php)

&copy; 2017 [harapeko](https://twitter.com/harapeko_wktk)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
