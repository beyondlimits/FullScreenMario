/* sprites.js */
// Contains functions for finding, setting, and manipulating sprites

// Resets the main canvas and context
function resetCanvas() {
  // The global canvas is one that fills the screen
  window.canvas = getCanvas(innerWidth, innerHeight, true);
  window.context = canvas.getContext("2d");
  body.appendChild(canvas);
}

/* Sprite Searching */
// These functions find a sprite in library.sprites, and parse it

// Goes through all the motions of finding and parsing a thing's sprite
// This is called when the sprite's appearance changes.
function setThingSprite(thing) {
  if(thing.hidden || !thing.title) return;
  
  // PixelRender does most of the work in fetching a rendered sprite
  thing.sprite = PixelRender.render(makeClassKey(thing), thing);
  
  // To do: remove dependency on .num_sprites and sprite_type
  if(thing.sprite.multiple) {
    thing.sprite_type = thing.sprite.type;
    refillThingCanvasMultiple(thing, thing.sprite);
  }
  else {
    thing.num_sprites = 1;
    thing.sprite_type = "normal";
    refillThingCanvas(thing, thing.sprite);
  }
}

// Utility to generate a className key given a thing's className
function makeClassKey(thing) {
  return (window.setting || window.defaultsetting) + ' ' + thing.libtype + ' ' + thing.title + ' ' + thing.className;
}

/* Pixel drawing */
// With sprites set, they must be drawn

// Draws a thing's sprite to its canvas
// Called when a new sprite is found from the library
// To do: memcpyU8 improvements?
function refillThingCanvas(thing, sprite) {
  var canvas = thing.canvas,
      context = thing.context,
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  memcpyU8(sprite, imageData.data);
  context.putImageData(imageData, 0, 0);
  return sprite;
}
// Simply calls refillThingCanvas on each sprite
function refillThingCanvasMultiple(thing, sprites_raw) {
  var sprites = thing.sprites = { multiple: true },
      canvas, context, imageData, i;
  thing.num_sprites = 1;
  for(i in sprites_raw.sprites) {
    // Make a new sprite for this individual component
    canvas = getCanvas(thing.spritewidth * unitsize, thing.spriteheight * unitsize);
    context = canvas.getContext("2d");
    // Copy over this sprite's information the same way as refillThingCanvas
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    memcpyU8(sprites_raw.sprites[i], imageData.data);
    context.putImageData(imageData, 0, 0);
    // Record the canvas and context in thing.sprites
    sprites[i] = {
      canvas: canvas,
      context: context
    }
    ++thing.num_sprites;
  }
  return sprites;
}

// This is called every upkeep to refill the main canvas
function refillCanvas() {
  var canvas = window.canvas,
      context = window.context,
      thing, i;
  
  context.fillStyle = window.fillStyle;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for(i = scenery.length - 1; i >= 0; --i) drawThingOnCanvas(context, scenery[i]);
  for(i = solids.length - 1; i >= 0; --i) drawThingOnCanvas(context, solids[i]);
  for(i = characters.length - 1; i >= 0; --i) drawThingOnCanvas(context, characters[i]);
}

// General function to draw a thing to a context
// Calls drawThingOnCanvas[Single/Multiple] with more arguments
function drawThingOnCanvas(context, me) {
  if(me.hidden) return;
  var leftc = me.left,
      topc = me.top;
  if(leftc > innerWidth) return;
  
  // If there's just one sprite, it's pretty simple
  // drawThingOnCanvasSingle(context, me.canvas, me, leftc, topc);
  if(me.num_sprites == 1) drawThingOnCanvasSingle(context, me.canvas, me, leftc, topc);
  // Otherwise some calculations will be needed
  else drawThingOnCanvasMultiple(context, me.canvases, me.canvas, me, leftc, topc);
}
// Used for the vast majority of sprites, where only one sprite is drawn
function drawThingOnCanvasSingle(context, canvas, me, leftc, topc) {
  if(me.repeat) drawPatternOnCanvas(context, canvas, leftc, topc, me.unitwidth, me.unitheight);
  // else context.putImageData(me.context.getImageData(0, 0, me.spritewidthpixels, me.spriteheightpixels), leftc, topc);
  else context.drawImage(canvas, leftc, topc);
}
// Slower than single; used when things have multiple sprites.
function drawThingOnCanvasMultiple(context, canvases, canvas, me, leftc, topc) {
  var sprites = me.sprites,
      topreal = me.top,
      leftreal = me.left,
      rightreal = me.right,
      bottomreal = me.bottom,
      widthreal = me.unitwidth,
      heightreal = me.unitheight,
      spritewidthpixels = me.spritewidthpixels,
      spriteheightpixels = me.spriteheightpixels,
      sdiff, canvasref;
  
  // Vertical sprites may have 'top', 'bottom', 'middle'
  switch(me.sprite.direction) {
    case "vertical":
      // If there's a bottom, draw that and push up bottomreal
      if(canvasref = sprites.bottom) {
        sdiff = sprites.bottomheight || me.spriteheightpixels;
        drawPatternOnCanvas(context, canvasref.canvas, leftreal, bottomreal - sdiff, spritewidthpixels, min(heightreal, spriteheightpixels));
        bottomreal -= sdiff;
        heightreal -= sdiff;
      }
      // If there's a top, draw that and push down topreal
      if(canvasref = sprites.top) {
        sdiff = sprites.topheight || me.spriteheightpixels;
        drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, spritewidthpixels, min(heightreal, spriteheightpixels));
        topreal += sdiff;
        heightreal -= sdiff;
      }
    break;
    // Horizontal sprites may have 'left', 'right', 'middle'
    case "horizontal":
      // If there's a left, draw that and push up leftreal
      if(canvasref = sprites.left) {
        sdiff = sprites.leftwidth || me.spritewidthpixels;
        drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, min(widthreal, spritewidthpixels), spriteheightpixels);
        leftreal += sdiff;
        widthreal -= sdiff;
      }
      // If there's a right, draw that and push back rightreal
      if(canvasref = sprites.right) {
        sdiff = sprites.rightwidth || me.spritewidthpixels;
        drawPatternOnCanvas(context, canvasref.canvas, rightreal - sdiff, topreal, min(widthreal, spritewidthpixels), spriteheightpixels);
        rightreal -= sdiff;
        widthreal -= sdiff;
      }
    break;
  }
  
  // If there's still room/*, and it exists*/, draw the actual canvas
  if((canvas = sprites.middle) && topreal < bottomreal && leftreal < rightreal) {
    drawPatternOnCanvas(context, sprites.middle.canvas, leftreal, topreal, widthreal, heightreal);
  }
}


/* Helpers */

// Because of how often it's used by the regular draw functions
// Not a fan of this lack of control over pattern source coordinates...
function drawPatternOnCanvas(context, source, leftc, topc, unitwidth, unitheight) {
  context.translate(leftc, topc);
  context.fillStyle = context.createPattern(source, "repeat");
  context.fillRect(0, 0, unitwidth, unitheight);
  context.translate(-leftc, -topc);
}

// Forces each thing to redraw itself
function clearAllSprites(clearcache) {
  var arrs = [window.solids, window.characters, window.scenery],
      arr, i;
  for(arr in arrs)
    for(i in (arr = arrs[arr]))
      setThingSprite(arr[i]);
  if(clearcache) library.cache = {};
}

// http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
// http://www.javascripture.com/Uint8ClampedArray
// function memcpyU8(source, destination, readloc, writeloc, length) {
  // if(readloc == null) readloc = 0;
  // if(length == null) length = source.length - readloc;
  // destination.set(source.subarray(readloc || 0, length), writeloc || 0);
// }
function memcpyU8(source, destination, readloc, writeloc, writelength) {
  if(!source || !destination || readloc < 0 || writeloc < 0 || writelength <= 0) return;
  if(readloc >= source.length || writeloc >= destination.length) {
    // console.log("Alert: memcpyU8 requested out of bounds!");
    // console.log("source, destination, readloc, writeloc, writelength");
    // console.log(arguments);
    return;
  }
  if(readloc == null) readloc = 0;
  if(writeloc == null) writeloc = 0;
  if(writelength == null) writelength = max(0, min(source.length, destination.length));

  var lwritelength = writelength + 0; // Allow JIT integer optimization (Firefox needs this)
  var lwriteloc = writeloc + 0;
  var lreadloc = readloc + 0;
  while(lwritelength--)
  // while(--lwritelength)
    destination[lwriteloc++] = source[lreadloc++];
}