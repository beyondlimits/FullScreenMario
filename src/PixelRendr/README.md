# PixelRendr.js

*An EightBittr.js module*


## What is PixelRendr.js?

PixelRendr.js is a graphics module designed to store images as compressed text blobs, store the text blobs in a folder-like system, and load those images. These tasks are to be performed and cached quickly enough for use in real-time environments, such as video games.


## What does it do?

At its core, PixelRendr.js is a library. It takes in sprites and string keys to store them under, and offers a fast lookup API. The internal folder structure storing images is at its core a tree, where strings are nodes similar to CSS classNames. For example, if the following structure is stored:

    {
        "Foo": {
            "Bar": {
                "Baz": "{Sprite A}"
            },
            "Quz": "{Sprite B}"
        }
    }
    
Looking up "Foo Bar Baz" will retrieve Sprite A, as will looking up "Foo Baz Bar" or "Baz Bar Foo". This is useful for situations where the ordering of an object's attributes is irrelevant and/or unknown.


## How can I make my own sprites?

The most straightforward way is to use a PixelRendr.js object's `.encodeURI(uri, callback)` method. In code:

    MyPixelRender.encodeURI("http://my.image.url.gif", function (results) {
        console.log(results);
    });

*Rendering is done by loading that image into an HTML `<img>` element, so any filetype supported by your browser is allowed.*


## What is this image format?

Images are stored as compressed arrays of integers, where each integer represents a color in a pre-defined palette. This custom notation is used over traditional image encoding to allow native filters on colors (more on that later).

### How is the palette stored?

In code, an array of arrays:

    [
        [0, 0, 0, 0],         // transparent
        [255, 255, 255, 255], // white
        [0, 0, 0, 255],       // black
        // ... and so on
    ]

This means the number '0' codes a transparent pixel in sprites, '1' codes a white pixel, and so on.


### How are images stored?

In short, an array of numbers:

    "00000001112"

This refers to seven transparent pixels, three white pixels, and a black pixel. Most images are much larger and more complex than this, so a couple of compression techniques are applied:

1. #### Palette Mapping
    
    It is necessary to have a consistent number of digits in images, as 010 could be [0, 1, 0], [0, 10], etc. So, for palettes with more than ten colors, [1, 14, 1] would be ["01", "14", "01"]:

        "011401"

    We can avoid this wasted character space by instructing a sprite to only use a subset of the pre-defined palette:

        "p[1,14]010"

    The 'p[0,14]' tells the renderer that this sprite only uses colors 0 and 14, so the number 0 should refer to palette number 1, and the number 1 should refer to palette number 14.

    *(This example is obviously less efficient, but overall the savings approach a 50% size reduction)*

2. #### Character Repetition

    Take the following wasteful sprite:

        "p[0]0000000000000000000000000000000000000000000000000"

    We know the 0 should be printed 35 times, so the following notation is used to indicate this:

        "p[0]x035,"

    *(Print ('x') 0 35 times (','))*


### How are filters applied?

All filtered sprites are references to previously existing sprites. So, there might be a filter defined for your raw library:

    "Sample": [ "palette", { "00": "03" } ]

...along with a couple of sprites:

    "foo": "p[0,7,14]000111222000111222000111222000111222000111222000111222000111222"

    "bar": [ "filter", ["foo"], "Sample"]

The "bar" sprite will be a *filter*ed version of *foo*, using the *Sample* filter. The Sample filter instructs the sprite to replace all instances of "00" with "03", so "bar" will be equivalent to:

    "bar": "p[3,7,14]000111222000111222000111222000111222000111222000111222000111222"

The benefit of using filters is automation: changes to one are reflected in the other. A reduced byte-size for your library is an added plus.

Another instruction you may use is "same", which is equivalent to directly copying a sprite with no changes:

    "baz": [ "same", ["bar"] ]

### What are 'multiple' sprites?

Objects commonly have to repeat a section of their image. Rather than use two objects to represent one, images may be directed to have one sub-image for the top/bottom or left/right, with a single sub-image filling in the middle.

    [ "multiple", "vertical", {
        "top": "{upper image data}",
        "bottom": "{repeated image data}"
    } ]


## Coding Documentation

*To be filled out!*

### Useful member variables

1. #### Library

    The library variable just stores two objects:

    1. ##### Raws

        The tree structure containing raw, unprocessed strings.

    2. ##### Sprites

        A tree structure of the same shape as Raws, but with the processed sprite strings.

2. #### ProcessorBase

    Runs the graphics pipeline. Output is cached, so string keys must be given (during initial library parsing, the real path is given, with strings separating the names).

3. #### BaseFiler

    Lookup wrapper for library.sprites. Given classes as space-joined arrays of strings (e.g. "one two three"), it returns and caches the output of ProcessorBase.
