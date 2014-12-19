/**
 * PixelRendr.js
 */
function PixelRendr(settings) {
    "use strict";
    if (!this || this === window) {
        return new PixelRendr(settings);
    }
    var self = this,

        // Library for storing sprite strings, along with a StringFilr interface
        library,
        BaseFiler,

        // Applies processing functions to turn raw strings into sprites
        // This is used on application startup
        ProcessorBase,

        // Takes sprites and repeats rows, then checks for dimension flipping
        // This is used on-demand, when dimensions are being set
        ProcessorDims,
        
        // Reverse of ProcessorBase: Takes real images and compresses their data
        ProcessorEncode,

        // Ordered array of arrays, each representing an RGBA value.
        // [0,0,0,0] is clear, [255,255,255,255] is white, and so on.
        palette_default,

        // Default digit size (how many characters per number)
        // E.x. "7" is 1, "07" is 2
        digitsize_default,

        // Utility RegExp to split strings on every #digitsize characters
        digitsplit,
        
        // How much to expand sprites by (definition fuzzy)
        unitsize,

        // How much to repeat each pixel
        scale,

        // String keys to know whether to flip a sprite, vertically or horizontally
        flip_vert,
        flip_horiz,

        // String keys for canvas creation & sizing from attributes
        sprite_width,
        sprite_height,

        // Associative array of color mapping filters
        // E.x. {"07" => "14"} maps all sevens to fourteens
        filters,
        
        // 
        Uint8ClampedArray;
    
    /**
     * 
     */
    self.reset = function (settings) {
        if (!settings.palette) {
            throw new Error("No palette given to PixelRendr.");
        }

        palette_default = settings.palette;
        digitsize_default = getDigitSize(palette_default);
        digitsplit = new RegExp('.{1,' + digitsize_default + '}', 'g');
        filters = settings.filters || {};
        unitsize = settings.unitsize || 4;
        scale = settings.scale || 2;
        flip_vert = settings.flip_vert || "flip-vert";
        flip_horiz = settings.flip_horiz || "flipped";
        sprite_width = settings.sprite_width || "sprite_width";
        sprite_height = settings.sprite_height || "sprite_height";
        Uint8ClampedArray = (
            settings.Uint8ClampedArray 
            || window.Uint8ClampedArray
            || window.Uint8Array 
            || Array
        );

        // The first ChangeLinr does the raw processing, of strings to sprites
        ProcessorBase = new ChangeLinr({
            "transforms": {
                "spriteUnravel": spriteUnravel,
                "spriteApplyFilter": spriteApplyFilter,
                "spriteExpand": spriteExpand,
                "spriteGetArray": spriteGetArray
            },
            "pipeline": [
                "spriteUnravel",
                "spriteApplyFilter",
                "spriteExpand",
                "spriteGetArray"
            ]
        });

        // The second ChangeLinr does row repeating and flipping
        ProcessorDims = new ChangeLinr({
            "transforms": {
                "spriteRepeatRows": spriteRepeatRows,
                "spriteFlipDimensions": spriteFlipDimensions
            },
            "pipeline": [
                "spriteRepeatRows",
                "spriteFlipDimensions"
            ]
        });
        
        // As a utility, a processor is included to encode image data to sprites
        ProcessorEncode = new ChangeLinr({
            "transforms": {
                "imageGetData": imageGetData,
                "imageGetPixels": imageGetPixels,
                "imageMapPalette": imageMapPalette,
                "imageCombinePixels": imageCombinePixels
            },
            "pipeline": [
                "imageGetData",
                "imageGetPixels",
                "imageMapPalette",
                "imageCombinePixels"
            ],
            "do_use_cache": false
        });

        // The library starts with raw sprites, but is parsed by ProcessorBase
        library = {
            "raws": settings.library || {},
            "posts": []
        };
        library.sprites = libraryParse(library.raws, ''),

        // Post commands are evaluated after the first processing run
        libraryPosts();

        // The BaseFiler provides a searchable 'view' on the library of sprites
        BaseFiler = new StringFilr({
            "library": library.sprites,
            "normal": "normal", // to do: put this somewhere more official?
        });
    };

    /* External functions
     */

    // Standard render function - given a key, find and parse the raw sprite
    // Attributes are needed so it can manipulate on width and height
    self.decode = function (key, attributes) {
        // BaseFiler stores the cache of the base sprites
        // It does not actually require the extra attributes
        var sprite = BaseFiler.get(key);
        if (!sprite) {
            throw new Error("No raw sprite found for " + key + ".");
        }
        
        // Multiple sprites have their sizings taken from attributes
        if (sprite.multiple) {
            if (!sprite.processed) {
                processSpriteMultiple(sprite, key, attributes);
            }
        }
        // Single (actual) sprites process for size (row) scaling, and flipping
        else {
            if (!(sprite instanceof Uint8ClampedArray)) {
                throw new Error("No single raw sprite found for: '" + key + "'");
            }
            sprite = ProcessorDims.process(sprite, key, attributes);
        }

        sprite.processed = true;
        return sprite;
    };

    /**
     * 
     */
    self.encode = function (image, callback, source) {
        var result = ProcessorEncode.process(image);
        
        if (callback) {
            callback(result, image, source);
        }
    };
    
    /**
     * 
     */
    self.encodeURI = function (source, callback) {
        var image = document.createElement("img");
        image.onload = self.encode.bind(self, image, callback);
        image.src = source;
    };
    
    /**
     * 
     */
    self.getBaseFiler = function () {
        return BaseFiler;
    };
    
    /**
     * 
     */
    self.getBaseLibrary = function () {
        return BaseFiler.getLibrary();
    };
    
    /**
     * 
     */
    self.getProcessorBase = function () {
        return ProcessorBase;
    };
    
    /**
     * 
     */
    self.getProcessorDims = function () {
        return ProcessorDims;
    };
    
    /**
     * 
     */
    self.getProcessorEncode = function () {
        return ProcessorEncode;
    };
    
    self.getSpriteBase = function (key) {
        return BaseFiler.get(key);
    }


    /* Library parsing
     */

    // Recursively go through everything in the library, parsing into sprite data
    function libraryParse(setref, path) {
        var setnew = {},
            objref, objnew,
            i;
        // For each child of the current layer:
        for (i in setref) {
            objref = setref[i];
            switch (objref.constructor) {
            // If it's a string, parse it
            case String:
                // setnew[i] = spriteGetArray(spriteExpand(spriteUnravel(objref)));
                setnew[i] = ProcessorBase.process(objref, path + ' ' + i);
                break;
            // If it's an array, it should have a command such as 'same' to be post-processed
            case Array:
                library.posts.push({
                    caller: setnew,
                    name: i,
                    command: setref[i],
                    path: path + ' ' + i
                });
                break;
            // If it's an object, simply recurse
            case Object:
                setnew[i] = libraryParse(objref, path + ' ' + i);
                break;
            }
        }
        return setnew;
    }

    // Post-processing (such as copies and filters) once the main processing finishes
    function libraryPosts() {
        var posts = library.posts,
            post, i;
        for (i = 0; i < posts.length; i += 1) {
            post = posts[i];
            post.caller[post.name] = evaluatePost(post.caller, post.command, post.path);
        }
    }

    // Returns an obj and the parsed version of the following parts of command
    function evaluatePost(caller, command, path) {
        switch (command[0]) {
        // Same: just returns a reference to the target
        // ["same", ["container", "path", "to", "target"]]
        case "same":
            var sprite_raw = followPath(library.raws, command[1], 0);
            switch (sprite_raw.constructor) {
            case String:
                return ProcessorBase.process(sprite_raw, path);
            case Array:
                return evaluatePost(caller, sprite_raw, path);
            default:
                return libraryParse(sprite_raw, path);
            }

        // Filter: takes a reference to the target, and applies a filter to it
        // ["filter", ["container", "path", "to", "target"], filters.DoThisFilter]
        case "filter":
            // Find the sprite this should be filtering from
            var sprite_raw = followPath(library.raws, command[1], 0),
                filter = filters[command[2]];
            if (!filter) {
                console.log("Invalid filter provided:", command[2], filters);
                // return sprite_raw;
                filter = {};
            }
            return evaluatePostFilter(sprite_raw, path, filter);

        // Multiple: uses more than one image, either vertically or horizontally
        // Not to be confused with having .repeat = true.
        // ["multiple", "vertical", {
        //    top: "...",       // (just once at the top)
        //    middle: "..."     // (repeated after top)
        //  }
        case "multiple":
            return evaluatePostMultiple(path, command);
        }
        
        // Commands not evaluated by the switch are unknown and bad
        console.warn("Unknown command specified in post-processing: '" + command[0] + "'.", caller, command, path);
    }

    // Driver function to recursively apply a filter on a sprite / container
    function evaluatePostFilter(sprite_raw, path, filter) {
        // If it's just a String, process the sprite normally
        if (typeof (sprite_raw) == "string") {
            return ProcessorBase.process(sprite_raw, path, {
                filter: filter
            });
        }

        // If it's an Array, that's a post that hasn't yet been evaluated: evaluate it by the path
        if (sprite_raw instanceof Array) {
            return evaluatePostFilter(followPath(library.raws, sprite_raw[1], 0), sprite_raw[1].join(' '), filter);
        }

        // If it's a generic Object, go recursively on its children
        if (sprite_raw instanceof Object) {
            var output = {},
                i;
            for (i in sprite_raw) {
                output[i] = evaluatePostFilter(sprite_raw[i], path + ' ' + i, filter);
            }
            return output;
        }

        // Anything else is a complaint
        console.warn("Invalid sprite provided for a post filter.", sprite_raw, path, filter);
    }

    //
    function evaluatePostMultiple(path, command) {
        var direction = command[1],
            dir_path = ' ' + direction + ' ',
            sections = command[2],
            output = new self.SpriteMultiple(command[1], direction),
            i;
        
        for (i in sections) {
            output.sprites[i] = ProcessorBase.process(sections[i], path + direction + i);
        }
        
        output.topheight = sections.topheight | 0;
        output.rightwidth = sections.rightwidth | 0;
        output.bottomheight = sections.bottomheight | 0;
        output.leftwidth = sections.leftwidth | 0;
        
        output.middleStretch = sections.middleStretch || false;
        
        return output;
    }


    // Used so object.constructor is super awesome
    // Type is 'horizontal' or 'vertical'
    self.SpriteMultiple = function (type, direction) {
        this.type = type;
        this.direction = direction;
        this.multiple = true;
        this.sprites = {};
        this.decoded = false;
    }
    

    /* Actual pipeline functions
     */

    // Given a compressed raw sprite data string, this 'unravels' it (uncompresses)
    // This is the first function called on strings in libraryParse
    // This could output the Uint8ClampedArray immediately if given the area - deliberately does not, for ease of storage
    function spriteUnravel(colors) {
        var paletteref = getPaletteReferenceStarting(palette_default),
            digitsize = digitsize_default,
            clength = colors.length,
            current, rep, nixloc, newp, i, len,
            output = "",
            loc = 0;
        while (loc < clength) {
            switch (colors[loc]) {
                // A loop, ordered as 'x char times ,'
            case 'x':
                // Get the location of the ending comma
                nixloc = colors.indexOf(",", ++loc);
                // Get the color
                current = makeDigit(paletteref[colors.slice(loc, loc += digitsize)], digitsize_default);
                // Get the rep times
                rep = Number(colors.slice(loc, nixloc));
                // Add that int to output, rep many times
                while (rep--) {
                    output += current;
                }
                loc = nixloc + 1;
                break;

                // A palette changer, in the form 'p[X,Y,Z...]' (or 'p' for default)
            case 'p':
                // If the next character is a '[', customize.
                if (colors[++loc] == '[') {
                    nixloc = colors.indexOf(']');
                    // Isolate and split the new palette's numbers
                    paletteref = getPaletteReference(colors.slice(loc + 1, nixloc).split(","));
                    loc = nixloc + 1;
                    digitsize = 1;
                }
                // Otherwise go back to default
                else {
                    paletteref = getPaletteReference(palette_default);
                    digitsize = digitsize_default;
                }
                break;

                // A typical number
            default:
                output += makeDigit(paletteref[colors.slice(loc, loc += digitsize)], digitsize_default);
                break;
            }
        }

        return output;
    }

    // Now that the sprite is unraveled, expand it to scale (repeat characters)
    // Height isn't known, so it'll be created during drawtime
    function spriteExpand(colors) {
        var output = "",
            clength = colors.length,
            current, i = 0,
            j;

        // For each number,
        while (i < clength) {
            current = colors.slice(i, i += digitsize_default);
            // Put it into output as many times as needed
            for (j = 0; j < scale; ++j)
                output += current;
        }
        return output;
    }

    // Used during post-processing before spriteGetArray to filter colors
    function spriteApplyFilter(sprite, key, attributes) {
        // If there isn't a filter (as is the normal), just return the sprite
        if (!attributes || !attributes.filter) return sprite;
        var filter = attributes.filter,
            filter_name = filter[0];
        if (!filter_name) return sprite;

        switch (filter_name) {
            // Palette filters switch all instances of one color with another
        case "palette":
            // Split the sprite on on each digit ('...1234...' => [...,'12','34,...]
            var split = sprite.match(digitsplit),
                i;
            // For each color filter to be applied, replace it
            for (i in filter[1])
                arrayReplace(split, i, filter[1][i]);
            return split.join('');
        }
        return sprite;
    }

    // Given the expanded version of colors, output the rgba array
    function spriteGetArray(colors) {
        var clength = colors.length,
            numcolors = clength / digitsize_default,
            split = colors.match(digitsplit),
            olength = numcolors * 4,
            output = new Uint8ClampedArray(olength),
            reference, i, j, k;
        // For each color,
        for (i = 0, j = 0; i < numcolors; ++i) {
            // Grab its RGBA ints
            reference = palette_default[Number(split[i])];
            // Place each in output
            for (k = 0; k < 4; ++k)
                output[j + k] = reference[k];
            j += 4;
        }

        return output;
    }

    // Repeats each row of a sprite based on the container attributes
    function spriteRepeatRows(sprite, key, attributes) {
        // With the rows set, repeat them by unitsize to create the final, parsed product
        var parsed = new Uint8ClampedArray(sprite.length * scale),
            rowsize = attributes[sprite_width] * 4,
            heightscale = attributes[sprite_height] * scale,
            readloc = 0,
            writeloc = 0,
            si, sj;
        
        // For each row:
        for (si = 0; si < heightscale; ++si) {
            // Add it to parsed x scale
            for (sj = 0; sj < scale; ++sj) {
                self.memcpyU8(sprite, parsed, readloc, writeloc, rowsize);
                writeloc += rowsize;
            }
            readloc += rowsize;
        }

        return parsed;
    }

    // Flips a sprite based on flip_vert and flip_horiz
    // To do: cache this again, like it used to
    function spriteFlipDimensions(sprite, key, attributes) {
        if (key.indexOf(flip_horiz) != -1) {
            if (key.indexOf(flip_vert) != -1) {
                return flipSpriteArrayBoth(sprite, attributes);
            } else {
                return flipSpriteArrayHoriz(sprite, attributes);
            }
        } else if (key.indexOf(flip_vert) != -1) {
            return flipSpriteArrayVert(sprite, attributes);
        }
        return sprite;
    }

    // Flipping horizontally is reversing pixels within each row
    function flipSpriteArrayHoriz(sprite, thing) {
        var length = sprite.length,
            width = thing.spritewidth,
            height = thing.spriteheight,
            newsprite = new Uint8ClampedArray(length),
            rowsize = width * unitsize * 4,
            newloc, oldloc,
            i, j, k;
        // For each row
        for (i = 0; i < length; i += rowsize) {
            newloc = i;
            oldloc = i + rowsize - 4;
            // For each pixel
            for (j = 0; j < rowsize; j += 4) {
                for (k = 0; k < 4; ++k)
                    newsprite[newloc + k] = sprite[oldloc + k];
                newloc += 4;
                oldloc -= 4;
            }
        }
        return newsprite;
    }
    // Flipping vertically is reversing the order of rows
    function flipSpriteArrayVert(sprite, thing) {
        var length = sprite.length,
            width = thing.spritewidth,
            height = thing.spriteheight,
            newsprite = new Uint8ClampedArray(length),
            rowsize = width * unitsize * 4,
            newloc = 0,
            oldloc = length - rowsize,
            i, j, k;

        // For each row
        while (newloc < length) {
            // For each pixel in the rows
            for (i = 0; i < rowsize; i += 4) {
                // For each rgba value
                for (j = 0; j < 4; ++j) {
                    newsprite[newloc + i + j] = sprite[oldloc + i + j];
                }
            }
            newloc += rowsize;
            oldloc -= rowsize;
        }

        return newsprite;
    }
    // Flipping both horizontally and vertically is actually just reversing the order of pixels
    function flipSpriteArrayBoth(sprite) {
        var length = sprite.length,
            newsprite = new Uint8ClampedArray(length),
            oldloc = sprite.length - 4,
            newloc = 0,
            i;
        while (newloc < length) {
            for (i = 0; i < 4; ++i)
                newsprite[newloc + i] = sprite[oldloc + i];
            newloc += 4;
            oldloc -= 4;
        }
        return newsprite;
    }

    // SpriteMultiple components need to be individually processed
    function processSpriteMultiple(sprite, key, attributes) {
        for (var i in sprite.sprites) {
            if (sprite.sprites[i] instanceof Uint8ClampedArray) {
                sprite.sprites[i] = ProcessorDims.process(sprite.sprites[i], key + ' ' + i, attributes);
            }
        }
        
        sprite.processed = true;
    }

    
    /* Encoding pipeline functions
    */
    
    /**
     * 
     */
    function imageGetData(image) {
        var canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");
        
        canvas.width = image.width;
        canvas.height = image.height;
        
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
    }
    
    /**
     * 
     */
    function imageGetPixels(data) {
        var pixels = new Array(data.length / 4),
            occurences = {},
            pixel,
            i, j;
        
        for (i = 0, j = 0; i < data.length; i += 4, j += 1) {
            pixel = getClosestInPalette(data.subarray(i, i + 4));
            pixels[j] = pixel;
            
            if (occurences.hasOwnProperty(pixel)) {
                occurences[pixel] += 1;
            } else {
                occurences[pixel] = 1;
            }
        }
        
        return [pixels, occurences];
    }
    
    /**
     * 
     */
    function imageMapPalette(information) {
        var pixels = information[0],
            occurences = information[1],
            palette = Object.keys(occurences),
            digitsize = getDigitSize(palette),
            palette_indices = getValueIndices(palette),
            numbers = pixels.map(getKeyValue.bind(undefined, palette_indices));
        
        return [palette, numbers, digitsize];
    }
    
    /**
     * 
     */
    function imageCombinePixels(information) {
        var palette = information[0],
            numbers = information[1],
            digitsize = information[2],
            threshold = Math.max(3, Math.round(4 / digitsize)),
            output,
            current,
            digit,
            i = 0,
            j;
        
        output = "p["
            + palette.map(makeSizedDigit.bind(undefined, digitsize)).join(',')
            + "]";
        
        while(i < numbers.length) {
            j = i + 1;
            current = numbers[i];
            digit = makeDigit(current, digitsize);
            
            while(current == numbers[j]) {
                j += 1;
            }
            
            if (j - i > threshold) {
                output += "x" + digit + String(j - i) + ",";
                i = j;
            } else {
                do {
                    output += digit;
                    i += 1;
                }
                while(i < j);
            }
        }
        
        return output;
    }
    

    /* Misc. utility functions
     */

    // Returns what a digitsize should be from a palette
    // E.x. A palette with 20 colors gives 2; 117 colors gives 3
    // @param {Array} palette
    function getDigitSize(palette) {
        return Number(String(palette.length).length);
    }
    
    /**
     * 
     */
    function getDigitSizeFromLength(length) {
        return Numbet(String(length).length);
    }

    // Given a palette array, this returns the actual palette object
    // E.x. [0,7] becomes {0: 0, 1: 7}
    function getPaletteReference(palette) {
        var output = {},
            digitsize = getDigitSize(palette);
        for (var i = 0; i < palette.length; ++i)
            output[makeDigit(i, digitsize)] = makeDigit(palette[i], digitsize);
        return output;
    }

    // Given a string of a palette, this returns the actual palette object
    // E.x. "p[0,7]" becomes {0: 0, 1: 7}
    function getPaletteReferenceStarting(palette) {
        var output = {};
        for (var i = 0; i < palette.length; ++i)
            output[makeDigit(i, digitsize_default)] = makeDigit(i, digitsize_default)
        return output;
    }
    
    /**
     * 
     */
    function getClosestInPalette(rgba) {
        var difference,
            best_difference = Infinity,
            best_i,
            i;
        
        for (i = palette_default.length - 1; i >= 0; i -= 1) {
            difference = arrayDifference(palette_default[i], rgba);
            if (difference < best_difference) {
                best_difference = difference;
                best_i = i;
            }
        }
        
        return best_i;
    }

    // Creates a string of me, repeated n times
    function stringOf(me, n) {
        return (n == 0) ? '' : new Array(1 + (n || 1)).join(me);
    }

    // Converts ('7',3,1) to '117'
    function makeDigit(num, size) {
        return stringOf('0', Math.max(0, size - String(num).length)) + num;
    }
    
    // Curry function (useful for binding)
    function makeSizedDigit(size, num) {
        return makeDigit(num, size);
    }

    // Equivalent of String.replace for Arrays
    function arrayReplace(arr, outs, ins) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] == outs) {
                arr[i] = ins;
            }
        }
        return arr;
    }
    
    /**
     * 
     */
    function arrayDifference(a, b) {
        var sum = 0,
            i;
        for (i = a.length - 1; i >= 0; i -= 1) {
            sum += Math.abs(a[i] - b[i]);
        }
        return sum;
    }
    
    /**
     * 
     */
    function getValueIndices(array) {
        var output = {},
            i;
        
        for (i = 0; i < array.length; i += 1) {
            output[array[i]] = i;
        }
        
        return output;
    }
    
    /**
     * 
     */
    function getKeyValue(object, key) {
        return object[key];
    }

    // Follows a path inside an object recursively
    // Path is ["path", "to", "target"], where num is how far along the path it is
    // Num must be given at start, for performance reasons
    function followPath(obj, path, num) {
        if (path.hasOwnProperty(num) && obj.hasOwnProperty(path[num]))
            return followPath(obj[path[num]], path, num + 1);
        return obj;
    }

    // http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
    // http://www.javascripture.com/Uint8ClampedArray
    // function memcpyU8(source, destination, readloc, writeloc, length) {
    // if (readloc == null) readloc = 0;
    // if (length == null) length = source.length - readloc;
    // destination.set(source.subarray(readloc || 0, length), writeloc || 0);
    // }
    self.memcpyU8 = function (source, destination, readloc, writeloc, writelength) {
        if (!source || !destination || readloc < 0 || writeloc < 0 || writelength <= 0) return;
        if (readloc >= source.length || writeloc >= destination.length) {
            // console.log("Alert: memcpyU8 requested out of bounds!");
            // console.log("source, destination, readloc, writeloc, writelength");
            // console.log(arguments);
            return;
        }
        if (readloc == null) readloc = 0;
        if (writeloc == null) writeloc = 0;
        if (writelength == null) writelength = Math.max(0, Math.min(source.length, destination.length));

        var lwritelength = writelength + 0; // Allow JIT integer optimization (Firefox needs this)
        var lwriteloc = writeloc + 0;
        var lreadloc = readloc + 0;
        while (lwritelength--)
        // while(--lwritelength)
            destination[lwriteloc++] = source[lreadloc++];
    }

    self.reset(settings || {});
}