This is the general getting started guide for FullScreenMario. You'll want to read the [readme](README.md) first to learn how the general system works.

### Table of Contents

1. [General Usage](#GeneralUsage)
2. [Things](#Things)
    1. [ObjectMakr](#ObjectMakr)
    2. [GroupHoldr](#GroupHoldr)
    3. [Spawning](#Spawning)
    4. [Movements](#Movements)
3. [Maps](#Maps)
    1. [MapsCreatr](#MapsCreatr)
    2. [MapsHandlr](#MapsHandlr)
    3. [MapScreenr](#MapScreenr)

## General Usage

FullScreenMario (FullScreenMario.js) is the governing class. The global `window.FSM` is an instance of FullScreenMario, and everything in the game is a member of FSM. The FullScreenMario class itself inherits from GameStartr (GameStartr/GameStartr.js), which inherits from EightBittr (GameStartr/EightBittr.js).

The base GameStartr engine includes a large number of modules, all of which are stored in /GameStartr (GameStartr/AudioPlayr, etc.). The naming schema is to have two words, the second of which is a verb ending with 'r'. The class will have the ending two characters abbreviated to 'r', and the instances aren't abbreviated. FSM.ObjectMaker, for example, is an ObjectMakr instance.

## Things

Everything you see in the game (trees, blocks, the player, etc.) is a Thing. The Thing class is subclassed by a new class for everything (Tree class, Block class, Player class, etc.). When added to the game, a Thing has a number of properties filled out. These include velocities (xvel and yvel), positioning (top, right, bottom, left), and so on.

### ObjectMakr

