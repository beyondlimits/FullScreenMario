This is the general getting started guide for FullScreenMario. You'll want to read the [readme](README.md) first to learn how the general system works.

### Table of Contents

1. [General Usage](#general-usage)
2. [Things](#things)
    1. [ObjectMakr](#objectmakr)
    2. [GroupHoldr](#GroupHoldr)
    3. [Spawning](#spawning)
    4. [Movements](#movements)
3. [Maps](#Maps)
    1. [MapsCreatr](#mapscreatr)
    2. [MapsHandlr](#mapshandlr)
    3. [MapScreenr](#mapscreenr)

## General Usage

FullScreenMario (FullScreenMario.js) is the governing class. The global `window.FSM` is an instance of FullScreenMario, and everything in the game is a member of FSM. The FullScreenMario class itself inherits from GameStartr (GameStartr/GameStartr.js), which inherits from EightBittr (GameStartr/EightBittr.js).

The base GameStartr engine includes a large number of modules, all of which are stored in /GameStartr (GameStartr/AudioPlayr, etc.). The naming schema is to have two words, the second of which is a verb ending with 'r'. The class will have the ending two characters abbreviated to 'r', and the instances aren't abbreviated. FSM.ObjectMaker, for example, is an ObjectMakr instance.

## Things

Everything you see in the game (trees, blocks, the player, etc.) is a Thing. The Thing class is subclassed by a new class for everything (Tree class, Block class, Player class, etc.). When added to the game, a Thing has a number of properties filled out. These include velocities (xvel and yvel), positioning (top, right, bottom, left), and so on.

Coordinates are relative to the top-right part of the screen. If you have experience with CSS, this is the same as positioning HTML elements absolutely. To add a new Thing to the game, use `FSM.addThing("type", #left, #top)`:

```javascript
FSM.addThing("Block") // Creates a new Cloud and adds it at x=0, y=0
FSM.addThing("Brick", 32, 64) // Creates a new Brick and adds it at x=32, y=64
```

### ObjectMakr

All of FullScreenMario's non-GameStartr classes, including Thing and its subclasses, are defined in `settings/objects.js`. In short, the class hierarchy is stored under `FullScreenMario.prototype.settings.objects.inheritance` and the attributes for each class are stored under `FullScreenMario.prototype.settings.objects.properties`. You may read [ObjectMakr's readme](/blob/GameStartr/ObjectMakr/README.md) for a full explanation.

`FSM.ObjectMakr.make("type")` is how you make a new Thing in the game. It takes in a string for the class name, and optionally an object containing additional properties for it. For example:

```javascript
FSM.ObjectMakr.make("Block") // Creates a new Block
// Creates a new Brick with a Mushroom inside
FSM.ObjectMakr.make("Brick", {
    "contents": "Mushroom"
});
```

### GroupHoldr

Each Thing has a groupType string property that determines what group it's considered to be in. These are, in order from visible top to bottom:

* Text
* Character
* Solid
* Scenery

`FSM.GroupHoldr` contains an Array for each of the groups; each Array contains all the Things of that type currently in the game. Things are added to their respective group when added to the game, and removed when they die. The groups are accessible both by static name and via passing in a String:

```javascript
// These all return the Array of Solids
FSM.GroupHolder.getSolidGroup(); 
FSM.GroupHolder.getGroup("Solid");
FSM.GroupHolder.getGroups()["Solid"]; 
```