declare module FullScreenMario {
    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map. A bounding box of the current viewport is kept, along with a bag
     * of assorted variable values.
     */
    export interface IMapScreenr extends MapScreenr.IMapScreenr {
        /**
         * The bottom position to spawn infinitely floating platforms to and from.
         */
        bottomPlatformMax: number;

        /**
         * Whether the screen may current scroll horizontally.
         */
        canscroll: boolean;

        /**
         * How far from the top of the screen Floor objects should be placed.
         */
        floor: number;

        /**
         * How much to increase y-velocity of Characters that aren't resting.
         */
        gravity: number;

        /**
         * A modifier to calculate a jumping Player's y-velocity.
         */
        jumpmod: number;

        /**
         * A singleton Lakitu that may be active in-game.
         */
        lakitu?: ILakitu;

        /**
         * The maximum falling y-velocity for a Player.
         */
        maxyvel: number;

        /**
         * The maximum upward velocity for a jumping Player.
         */
        maxyvelinv: number;

        /**
         * Whether user input keys are currently disabled.
         */
        nokeys: boolean;

        /**
         * Whether decreasing game time is currently disabled.
         */
        notime: boolean;

        /**
         * Whether a Castle loop section has been passed.
         */
        sectionPassed?: boolean;

        /**
         * Whether the game screen is currently spawning CheepCheeps.
         */
        spawningCheeps?: boolean;

        /**
         * Whether the game screen is currently spawning BulletBills.
         */
        spawningBulletBills?: boolean;

        /**
         * Whether the current Area is underwater.
         */
        underwater?: boolean;
    }

    /**
     * A Map parsed from its raw JSON-friendly description.
     */
    export interface IMap extends MapsCreatr.IMapsCreatrMap {
        /**
         * The default location for the Map.
         */
        locationDefault?: string;

        /**
         * A starting seed to initialize random number generation.
         */
        seed?: number | number[];

        /**
         * The default starting time.
         */
        time?: number;
    }

    /**
     * An Area parsed from a JSON-friendly Map description.
     */
    export interface IArea extends MapsCreatr.IMapsCreatrArea {
        /**
         * Any additional attributes that should add extra properties to this Area.
         */
        attributes?: {
            [i: string]: any;
        };

        /**
         * A Location to transport to instead of dieing upon falling through the floor.
         */
        exit?: string | number;

        /**
         * The background color to display behind all Things.
         */
        background: string;

        /**
         * A callback to initialize the Area background as a function of its setting.
         */
        setBackground: (area: IArea) => void;

        /**
         * A callback for when a Player runs out of lives.
         */
        onGameOver: (FSM: IFullScreenMario) => void;

        /**
         * How long to wait before calling onGameOver.
         */
        onGameOverTimeout: number;

        /**
         * A callback for when a Player loses a life (dies).
         */
        onPlayerDeath: (FSM: IFullScreenMario) => void;

        /**
         * How long to wait before calling onPlayerDeath.
         */
        onPlayerDeathTimeout: number;

        /**
         * Components of stretchable Castle sections.
         */
        sections?: any[];

        /**
         * A starting time to use instead of the container Map's.
         */
        time?: number;
    }

    /**
     * A Location parsed from a raw JSON-friendly Map description.
     */
    export interface ILocation extends MapsCreatr.IMapsCreatrLocation {
        /**
         * How far this is from the left-most edge of the parent Area.
         */
        xloc: number;

        /**
         * A Thing to snap a Player and xloc to when spawning at this Location.
         */
        entrance?: IThing;
    }

    /**
     * Current status of device motion across all recognized axis.
     */
    export interface IDeviceMotionStatus {
        /**
         * Whether the device is currently moving to the left.
         */
        motionLeft: boolean;

        /**
         * Whether the device is currently moving to the right.
         */
        motionRight: boolean;

        /**
         * The device's current horizontal acceleration.
         */
        x: number;

        /**
         * The device's current vertical acceleration.
         */
        y: number;

        /**
         * How much the vertical acceleration has changed since the last upkeep.
         */
        dy: number;
    }

    /**
     * A position holder around an in-game Thing.
     */
    export interface IPreThing extends MapsCreatr.IPreThing {
        /**
         * The in-game Thing.
         */
        thing: IThing;
    }

    /**
     * An in-game Thing with size, velocity, position, and other information.
     */
    export interface IThing extends GameStartr.IThing {
        /**
         * The parent IFullScreenMario controlling this Thing.
         */
        FSM: IFullScreenMario;

        /**
         * Whether this is currently alive and able to move.
         */
        alive: boolean;

        /**
         * Whether this has been killed.
         */
        dead?: boolean;

        /**
         * Whether this is "flickering" (switching hidden on and off).
         */
        flickering?: boolean;

        /**
         * How many quadrants this is currently a member of.
         */
        numquads: number;

        /**
         * Whether this is allowed to exist outside the Quadrant boundaries, as
         * `true` for when to the right of the delx, or `2` for always.
         */
        outerok: boolean | number;

        /**
         * Whether this is allowed to fall due to gravity.
         */
        nofall?: boolean;

        /**
         * Scratch variable for whether this is allowed to fall due to gravity.
         */
        nofallOld?: boolean;

        /**
         * Whether this is barred from colliding with other Things.
         */
        nocollide?: boolean;

        /**
         * Scratch flag for whether this is barred from colliding with other Things.
         */
        nocollideOld?: boolean;

        /**
         * Scratch storage for the normal Function to move during an upkeep event.
         */
        movementOld?: Function;

        /**
         * Other Things in the same collection as this one.
         */
        partners?: {
            [i: string]: IThing
        };

        /**
         * Whether to shift this to the "beginning" or "end" of its Things group.
         */
        position?: string;

        /**
         * Horizontal tolerance for not colliding with another Thing.
         */
        tolx: number;

        /**
         * Vertical tolerance for not colliding with another Thing.
         */
        toly: number;

        /**
         * Original x-position, copied from the PreThing settings.
         */
        x: number;

        /**
         * Original y-position, copied from the PreThing settings.
         */
        y: number;
    }

    /**
     * An in-game Thing that can float up and down.
     */
    export interface IThingFloating extends IThing {
        /**
         * The beginning y-position of floatation.
         */
        begin: number;

        /**
         * The end y-position of floatation.
         */
        end: number;

        /**
         * The maximum velocity of floatation.
         */
        maxvel: number;
    }

    /**
     * An in-game Thing that can float side to side.
     */
    export interface IThingSliding extends IThing {
        /**
         * The beginning x-position of floatation.
         */
        begin: number;

        /**
         * The end x-position of floatation.
         */
        end: number;

        /**
         * The maximum velocity of floatation.
         */
        maxvel: number;
    }

    /**
     * An in-game Thing wrapping around some number of Text Things.
     */
    export interface ICustomText extends IThing {
        /**
         * Children Text Things spawned as characters.
         */
        children: IText[];

        /**
         * What type of text the children should be, as "", "Colored", "Large", or "Huge".
         */
        size: string;

        /**
         * How much horizontal space to put between children.
         */
        spacingHorizontal: number;

        /**
         * How much vertical space to put between lines of children.
         */
        spacingVertical: number;

        /**
         * How much vertical space to use when a blank line is given.
         */
        spacingVerticalBlank: number;

        /**
         * Any additional attributes to give to children.
         */
        textAttributes?: any;

        /**
         * Raw descriptions of text to display as children Text Things.
         */
        texts: ICustomTextInfo[];
    }

    /**
     * A line of text in a CustomText Thing.
     */
    export interface ICustomTextInfo {
        /**
         * The line of text to display.
         */
        text: string;

        /**
         * How much horizontal offset to put before the line of text.
         */
        offset: number;
    }

    /**
     * A single character of text in a line of characters.
     */
    export interface IText extends IThing {
        /**
         * What type of text this is, as "", "Colored", "Large", or "Huge".
         */
        size: string;
    }

    /**
     * Text title replacements for Text Things.
     */
    export interface ITextMappings {
        [i: string]: string;
    }

    /**
     * A solid Thing that may be rested upon or bumped into.
     */
    export interface ISolid extends IThing {
        /**
         * A callback for when a Player actively runs into this from the left.
         */
        actionLeft?: (thing: ICharacter, other: ISolid, transport?: any) => void;

        /**
         * A callback for when a Player actively attemps to crouch on top of this.
         */
        actionTop?: (thing: ICharacter, other: ISolid, transport?: any) => void;

        /**
         * A Character holding onto this, such as with a Vine or Flagpole.
         */
        attachedCharacter?: ICharacter;

        /**
         * A callback for when a Player jumps up and hits the bottom of this.
         */
        bottomBump?: (thing: ISolid, other: ICharacter) => void;

        /**
         * A callback for when a Character collides with this.
         */
        collide: (thing: ICharacter, other: ISolid) => void;

        /**
         * Whether this can be collided with while hidden.
         */
        collideHidden?: boolean;

        /**
         * Whether this should be killed when a level is completed, either as a Boolean
         * for true/false or a callback Function to do so.
         */
        killonend?: boolean | { (thing: ISolid, group: ISolid[], i: number): void };

        /**
         * A callback for when a Character starts resting on this.
         */
        onRestedUpon?: (thing: ISolid, other: ICharacter) => void;

        /**
         * Whether this is a solid (always true for Solids, but not for other Things).
         */
        solid: boolean;

        /**
         * A Map and/or Location transportation description to take a Player to when
         * a transportation action is triggered.
         */
        transport?: any;

        /**
         * A Character that bottom-bumped this Solid into being "up".
         */
        up?: ICharacter;
    }

    /**
     * A Brick Solid.
     */
    export interface IBrick extends ISolid {
        /**
         * Whether this is currently breakable.
         */
        breakable: boolean;

        /**
         * Name of a Thing held inside.
         */
        contents?: string;

        /**
         * Whether this has coins and the last one has been reached.
         */
        lastcoin?: boolean;

        /**
         * Whether this has been used up.
         */
        used: boolean;
    }

    /**
     * A Block Solid.
     */
    export interface IBlock extends ISolid {
        /**
         * Name of a Thing held inside, if not "Coin".
         */
        contents: string;

        /**
         * Whether this has been used up.
         */
        used: boolean;
    }

    /**
     * A Cannon solid.
     */
    export interface ICannon extends ISolid {
        /**
         * How often this should fire a BulletBill.
         */
        frequency: number;

        /**
         * Whether this should never fire a BulletBill.
         */
        noBullets?: boolean;
    }

    /**
     * A CastleAxe Solid.
     */
    export interface ICastleAxe extends ISolid { }

    /**
     * A CastleBlock Solid, which may have a line Fireballs rotating around it.
     */
    export interface ICastleBlock extends ISolid {
        /**
         * What angle the attached line Fireballs are facing.
         */
        angle?: number;

        /**
         * The direction of Fireball spinning, as -1 for counter-clockwise or 1 
         * for clockwise (by default, clockwise).
         */
        direction: number;

        /**
         * How rapidly the Fireballs are rotating (difference in theta).
         */
        dt?: number;

        /**
         * How many Fireballs should extend from this.
         */
        fireballs: number;

        /**
         * How rapidly change the Fireball line's angle, as 7 / Math.abs(speed).
         */
        speed: number;
    }

    /**
     * An activateable detector Solid. After a single activation, it will kill itself.
     */
    export interface IDetector extends ISolid {
        /**
         * Callback for when a Thing activates this.
         * 
         * @param thing   The Thing that activated this.
         */
        activate(thing: IThing): void;
    }

    /**
     * A collision detector Solid for when a Player collides with this.
     */
    export interface IDetectCollision extends IDetector {
        /**
         * A callback for when a non-Player Character collides with this,
         * called from activate instead of Player functionality.
         */
        activateFail?: (thing: ICharacter) => void;

        /**
         * A callback for when a Character collides with this.
         */
        activate: (thing: ICharacter, other?: IDetectCollision) => void;

        /**
         * Whether this should abstain from killing itself after an activation.
         */
        noActivateDeath?: boolean;
    }

    /**
     * A detector that activates itself when it scrolls into view.
     */
    export interface IDetectWindow extends IDetector {
        /**
         * Callback for when this scrolls into view.
         * 
         * @param thing   This window detector.
         */
        activate(thing: IThing): void;
    }

    /**
     * A window detector that decides which looping Castle sub-section to spawn.
     */
    export interface ISectionDetector extends IDetectWindow {
        /**
         * The section whose sub-sections are to be chosen from.
         */
        section: number;
    }

    /**
     * A window detector that spawns a random map section.
     */
    export interface IRandomSpawner extends IDetectWindow {
        /**
         * The name of the possibilities container to spawn from.
         */
        randomization: string;

        /**
         * The top boundary for the randomization area.
         */
        randomTop: number;

        /**
         * The right boundary for the randomization area.
         */
        randomRight: number;

        /**
         * The bottom boundary for the randomization area.
         */
        randomBottom: number;

        /**
         * How wide the randomization area should be.
         */
        randomWidth: number;
    }

    /**
     * A window detector that immediately disables window scrolling.
     */
    export interface IScrollBlocker extends IDetectWindow {
        /**
         * Whether this has more than scrolled into view, and should trigger
         * a reverse scroll to compensate.
         */
        setEdge: boolean;
    }

    /**
     * A Pipe Solid.
     */
    export interface IPipe extends ISolid { }

    /**
     * A Platform Solid that may be floating, sliding, a transport, a falling trigger,
     * or a part of a partner-based Scale.
     */
    export interface IPlatform extends ISolid {
        /**
         * How much this is currently accelerating downward.
         */
        acceleration?: number;

        /**
         * Whether this has gone far enough down to be in a free-fall.
         */
        freefall?: boolean;

        /**
         * The y-velocity to start falling down, if a falling trigger.
         */
        fallThresholdStart?: number;

        /**
         * The maximum velocity achievable when in free fall.
         */
        fallThresholdEnd?: number;

        /**
         * The total y-velocity in this Platform, which is the inverse of
         * a Scale group's partner platform.
         */
        tension?: number;

        /**
         * Partners in a Scale group.
         */
        partners?: {
            /**
             * This Platform's String Scenery.
             */
            ownString: IScenery;

            /**
             * The partner Platform.
             */
            partnerPlatform: IPlatform;

            /**
             * The partner Platform's String Scenery.
             */
            partnerString: IScenery;

            [i: string]: IScenery | IPlatform;
        };
    }

    /**
     * A normally-invisible Solid to catch a respawning Player.
     */
    export interface IRestingStone extends ISolid {
        /**
         * Whether a Player has landed on this.
         */
        activated: boolean;
    }

    /**
     * A bouncy Springboard Solid.
     */
    export interface ISpringboard extends ISolid {
        /**
         * Scratch variable for the normal height of this Springboard.
         */
        heightNormal: number;

        /**
         * How much tension a Player's vertical velocity has added to this.
         */
        tension: number;

        /**
         * Scratch variable for how much tension a Player's vertical velocity has
         * added to this.
         */
        tensionSave?: number;
    }

    /**
     * A Vine Solid.
     */
    export interface IVine extends ISolid {
        /**
         * The Solid this Vine is growing out of.
         */
        attachedSolid: ISolid;

        /**
         * How rapidly this Vine should grow.
         */
        speed: number;
    }

    /**
     * A Character Thing.
     */
    export interface ICharacter extends IThing {
        /**
         * Whether this shouldn't be killed by "up" Solids.
         */
        allowUpSolids?: boolean;

        /**
         * A callback to animate this, such as when emerging from a Solid.
         */
        animate?: (thing: ICharacter, other?: ISolid) => void;

        /**
         * If this was spawned as a Solid's contents, the spawning Solid.
         */
        blockparent?: ISolid;

        /**
         * Whether this should check for any overlapping Solids.
         */
        checkOverlaps?: boolean;

        /**
         * A callback for when this collides with another Thing.
         * 
         * @param thing   The "primary" (first) Thing colliding.
         * @param other   The "secondary" (second) Thing colliding.
         */
        collide?: (thing: IThing, other: IThing) => void;

        /**
         * Whether this should always be the first Thing in collide arguments.
         */
        collidePrimary?: boolean;

        /**
         * A callback for when this dies.
         */
        death: (thing: IThing, severity?: number) => void;

        /**
         * What direction this is facing.
         */
        direction: number;

        /**
         * A callback for when this has finished emerging from a spawning Solid.
         * 
         * @param thing   This Character.
         * @param other   The spawning Solid.
         */
        emergeOut?: (thing: ICharacter, other: ISolid) => void;

        /**
         * How much to increase this Character's y-velocity each upkeep while falling.
         */
        gravity?: number;

        /**
         * How high to jump, if movement is moveJumping.
         */
        jumpheight?: number;

        /**
         * Whether this is currently visually looking to the left.
         */
        lookleft: boolean;

        /**
         * A callback for kill this Character on end, instead of killNormal.
         */
        killonend?: (thing: IThing) => void;

        /**
         * Whether this is a Player.
         */
        player?: boolean;

        /**
         * Whether this is currently facing to the left (by default, false).
         */
        moveleft: boolean;

        /**
         * Whether this is barred from colliding with other Characters.
         */
        nocollidechar?: boolean;

        /**
         * Whether this is barred from colliding with Player Characters.
         */
        nocollideplayer?: boolean;

        /**
         * Whether this is barred from colliding with Solids.
         */
        nocollidesolid?: boolean;

        /**
         * Whether this is resistant to fire, as 1 for ignoring it and 2 for Fireballs
         * blowing up upon collision.
         */
        nofire?: number;

        /**
         * Whether this has a custom death handler for when hit by a Fireball, such as
         * Koopas spawning shells.
         */
        nofiredeath?: boolean;

        /**
         * Whether this ignores visual horizontal flipping during moveSimple.
         */
        noflip?: boolean;

        /**
         * Whether this should skip being killed upon level completion.
         */
        nokillend?: boolean;

        /**
         * Whether this should ignore its movement Function during upkeeps.
         */
        nomove?: boolean;

        /**
         * A callback for when this is hit by an "up" Solid.
         * 
         * @param thing   This Character.
         * @param other   The "up" Solid hitting this Character.
         */
        onCollideUp?: (thing: ICharacter, other: ISolid) => void;

        /**
         * A callback for when this starts resting on a Solid.
         * 
         * @param thing   This Character.
         * @param other   The Solid now being rested upon.
         */
        onResting?: (thing: ICharacter, other: ISolid) => void;

        /**
         * A callback for when this stops resting on a Solid.
         *
         * @param thing   This Character.
         * @param other   The Solid no longer being rested upon.
         */
        onRestingOff?: (character: ICharacter, other: ISolid) => void;

        /**
         * Any Solids whose bounding boxes overlap this Character's.
         */
        overlaps?: ISolid[];

        /**
         * A Solid this is resting upon.
         */
        resting?: ISolid;

        /**
         * Points given for killing this by hitting an "up" Solid into it.
         */
        scoreBelow: number;

        /**
         * Points given for killing this by shooting a Fireball into it.
         */
        scoreFire: number;

        /**
         * Points given for killing this by running into it using Star power.
         */
        scoreStar: number;

        /**
         * Whether this is a Shell Thing.
         */
        shell?: boolean;

        /**
         * Whether this should spawn another Thing when killed by a moving Shell.
         */
        shellspawn?: boolean;

        /**
         * What type of Shell to spawn when killed.
         */
        shelltype?: string;

        /**
         * Whether this is "smart" (will not walk off cliffs).
         */
        smart?: boolean;

        /**
         * What type of Thing to typically spawn when killed.
         */
        spawnType?: string;

        /**
         * Any additional settings to give to a spawned Thing.
         */
        spawnSettings?: any;

        /**
         * How fast this moves.
         */
        speed: number;

        /**
         * Solids touching this Character's top.
         */
        under?: ISolid[];

        /**
         * A Solid touching this Character's top and above its horizontal center.
         */
        undermid?: ISolid;
    }

    /**
     * A Character that's overlapping with any number of Solids.
     */
    export interface ICharacterOverlapping extends ICharacter {
        /**
         * The horizontal location to check overlaps at.
         */
        overlapCheck: number;

        /**
         * The horizontal goal to slide to for removing overlaps.
         */
        overlapGoal: number;

        /**
         * Whether overlap correction should move this to the right.
         */
        overlapGoRight: boolean;
    }

    /**
     * A falling shard of a Brick.
     */
    export interface IBrickShard extends ICharacter { }

    /**
     * A Castle Fireball.
     */
    export interface ICastleFireball extends ICharacter { }

    /**
     * A malicious enemy Character.
     */
    export interface IEnemy extends ICharacter {
        /**
         * Whether this will kill a Player on contact, even if stepped on.
         */
        deadly?: boolean;

        /**
         * Whether this is an Enemy (true for all Enemy Characters).
         */
        enemy?: boolean;

        /**
         * Whether this ignores collisions with Star power Players.
         */
        nostar?: boolean;

        /**
         * Whether this is a Shell.
         */
        shell?: boolean;
    }

    /**
     * A Blooper Character.
     */
    export interface IBlooper extends IEnemy {
        /**
         * How long this Blooper has been squeezing itself to go down.
         */
        squeeze: number;

        /**
         * A general movement counter for moveBlooper.
         */
        counter: number;
    }

    /**
     * A piece of fire emitted by Bowser's mouth.
     */
    export interface IBowserFire extends IEnemy {
        /**
         * A target y-position to navigate to.
         */
        ylev: number;
    }

    /**
     * A BulletBill Character.
     */
    export interface IBulletBill extends IEnemy { }

    /**
     * A CheepCheep Character
     */
    export interface ICheepCheep extends IEnemy {
        /**
         * Whether this is gracefully flying through the air instead of swimming.
         */
        flying: boolean;
    }

    /**
     * A player-emited Fireball Enemy.
     */
    export interface IFireball extends IEnemy { }

    /**
     * A Goomba Enemy.
     */
    export interface IGoomba extends IEnemy { }

    /**
     * A HammerBro Enemy.
     */
    export interface IHammerBro extends IEnemy {
        /**
         * A general counter for movePacing.
         */
        counter: number;

        /**
         * Whether this is falling down a level.
         */
        falling: boolean;
    }

    /**
     * A Bowser Enemy.
     */
    export interface IBowser extends IHammerBro {
        /**
         * How many times this has been hit with a Player's Fireball.
         */
        deathcount: number;

        /**
         * Delays for shooting BowserFires.
         */
        fireTimes: number[];

        /**
         * Delays for jumping into the air.
         */
        jumpTimes: number[];

        /**
         * Whether this should skip throwing Hammers.
         */
        nothrow: boolean;

        /**
         * How many hammers to throw.
         */
        throwAmount?: number;

        /**
         * How long to delay between throwing Hammers.
         */
        throwBetween?: number;

        /**
         * How long to delay before throwing Hammers.
         */
        throwDelay?: number;

        /**
         * How many hammers to throw each cycle.
         */
        throwPeriod?: number;

        /**
         * Whether this is currently throwing Hammers.
         */
        throwing: boolean;
    }

    /**
     * A Koopa Enemy.
     */
    export interface IKoopa extends IEnemy {
        /**
         * Whether this is currently floating through the air.
         */
        floating: boolean;

        /**
         * Whether this is currently flapping wings to jump around.
         */
        jumping: boolean;
    }

    /**
     * A Lakitu Enemy.
     */
    export interface ILakitu extends IEnemy {
        /**
         * A standard counter for movePacing.
         */
        counter: number;

        /**
         * Whether this is fleeing to the left edge of the screen.
         */
        fleeing?: boolean;
    }

    /**
     * A Piranha enemy.
     */
    export interface IPiranha extends IEnemy {
        /**
         * A standard counter for movePiranha.
         */
        counter: number;

        /**
         * How long to wait before switching direction after a pause.
         */
        countermax: number;

        /**
         * What direction this is currently facing, as 1 (up) or -1 (down).
         */
        direction: number;

        /**
         * Whether this was spawned as part of a Pipe.
         */
        onPipe: boolean;
    }

    /**
     * A Podoboo Enemy.
     */
    export interface IPodoboo extends IEnemy {
        /**
         * How often this should jump.
         */
        frequency: number;

        /**
         * How high this should jump.
         */
        jumpHeight: number;

        /**
         * The recorded starting y-location.
         */
        starty: number;
    }

    /**
     * A SpinyEgg Enemy.
     */
    export interface ISpinyEgg extends IEnemy { }

    /**
     * A Spiny Enemy hatched from a SpinyEgg.
     */
    export interface ISpiny extends IEnemy { }

    /**
     * An item Players may interact with, such as power-ups.
     */
    export interface IItem extends ICharacter {
        /**
         * A callback for when a Player interacts with this item.
         * 
         * @param thing   A Player that just triggered this Item.
         * @param other   This Item being triggered.
         */
        action?: (thing: IPlayer, other: IItem) => void;

        /**
         * Whether this is an Item (always true for Items).
         */
        item?: boolean;
    }

    /**
     * A Coin Item that gives a Player a point when touched.
     */
    export interface ICoin extends IItem {
        /**
         * Animation callback for when this is bumped by a Solid.
         */
        animate(thing: ICoin, other: ISolid): void;
    }

    /**
     * A Shell that may be kicked by a Player into Characters.
     */
    export interface IShell extends IItem {
        /**
         * A counter for when this will turn back into its source Enemy.
         */
        counting: number;

        /**
         * How many Enemies this has killed.
         */
        enemyhitcount: number;

        /**
         * How many times a Player has hit this.
         */
        hitcount: number;

        /**
         * Whether a Player is currently landing on this.
         */
        landing: number;

        /**
         * Whether this is about to turn back into its source Enemy.
         */
        peeking: number;

        /**
         * When colliding with another Shell, whether this is to the left.
         */
        shelltoleft: boolean;

        /**
         * Whether this comes from a "smart" Koopa.
         */
        smart?: boolean;

        /**
         * Settings to pass onto an Enemy if turned back into one.
         */
        spawnSettings?: {
            /**
             * Whether this comes from a "smart" Koopa.
             */
            smart?: boolean;
        };
    }

    /**
     * A Star Item that grants a Player temporary invincibility.
     */
    export interface IStar extends IItem {
        /**
         * Whether this is a star (useful for collision checks).
         */
        star: boolean;
    }

    /**
     * A user-controlled Player Character.
     */
    export interface IPlayer extends ICharacter {
        /**
         * Whether this is currently climbing a Solid.
         */
        animatedClimbing?: boolean;

        /**
         * What direction an attached Solid is, as -1 (left) or 1 (right).
         */
        attachedDirection?: number;

        /**
         * Whether this is to the left of a colliding climbable Solid.
         */
        attachedLeft?: boolean;

        /**
         * A Solid this is climbing.
         */
        attachedSolid?: ISolid;

        /**
         * How far this must be from an attached Solid to remove itself.
         */
        attachedOff?: number;

        /**
         * Whether this is currently allowed to jump.
         */
        canjump?: boolean;

        /**
         * Whether this is currently climbing a Solid.
         */
        climbing?: boolean;

        /**
         * Whether this is currently crouching.
         */
        crouching: boolean;

        /**
         * Whether this was just killed and is now dieing.
         */
        dieing?: boolean;

        /**
         * A callback for when this Player shoots a Fireball.
         */
        fire: (player: IPlayer) => void;

        /**
         * Retrieval Function for a new user keys description.
         * 
         * @returns A new descriptor Object for a user's keys.
         */
        getKeys: () => IPlayerKeys;

        /**
         * Whether this is currently hopping on an enemy.
         */
        hopping?: boolean;

        /**
         * How many enemies this has jumped on without touching a Solid.
         */
        jumpcount: number;

        /**
         * How many simultaneous enemies this is currently jumping on.
         */
        jumpers?: number;

        /**
         * Whether this is currently jumping through the air.
         */
        jumping?: boolean;

        /**
         * A descriptor for a user's key's statuses.
         */
        keys: IPlayerKeys;

        /**
         * A maximum speed for this Player to run.
         */
        maxspeed: number;

        /**
         * Scratch variable to store maxspeed.
         */
        maxspeedsave?: number;

        /**
         * How many Fireballs this Player has dropped.
         */
        numballs: number;

        /**
         * Whether this is currently paddling through water.
         */
        paddling?: boolean;

        /**
         * Whether this currently has an animation cycle for paddling.
         */
        paddlingCycle?: boolean;

        /**
         * Whether this is currently moving into or out of a Pipe.
         */
        piping?: boolean;

        /**
         * How strong this is, as 1 (normal), 2 (big), or 3 (fiery).
         */
        power: number;

        /**
         * Whether this is currently running.
         */
        running: boolean;

        /**
         * A maximum scrolling speed for a window.
         */
        scrollspeed: number;

        /**
         * Whether this is currently skidding visually.
         */
        skidding?: boolean;

        /**
         * Whether this is increasing in power due to a Mushroom.
         */
        shrooming?: boolean;

        /**
         * An attached SpringBoard being jumped on.
         */
        spring?: ISpringboard;

        /**
         * A counter of how many Star power-ups this has collected that
         * are still active.
         */
        star: number;

        /**
         * Whether this is currently swimming, and possible paddling.
         */
        swimming?: boolean;

        /**
         * Scratch variable for tolx.
         */
        tolxOld?: number;

        /**
         * Scratch variable for toly.
         */
        tolyOld?: number;

        /**
         * Maximum speed to walk at during cutscenes.
         */
        walkspeed: number;
    }

    /**
     * A descriptor for a user's keys' statuses.
     */
    export interface IPlayerKeys {
        /**
         * Whether the user is indicating a crouch.
         */
        crouch: boolean;

        /**
         * Whether the user is indicating a jump.
         */
        jump: boolean;

        /**
         * How strongly the user is indicating a jump.
         */
        jumplev: number;

        /**
         * Whether the left key is being pressed.
         */
        leftDown?: boolean;

        /**
         * Whether the right key is being pressed.
         */
        rightDown?: boolean;

        /**
         * Whether either the left or right keys are being pressed.
         */
        run: number;

        /**
         * Whether the sprint key is being pressed.
         */
        sprint: boolean;

        /**
         * Whether the up key is being pressed.
         */
        up: boolean;
    }

    /**
     * A decorative Scenery Thing.
     */
    export interface IScenery extends IThing { }

    /**
     * A Firework Scenery that may animate an explosion.
     */
    export interface IFirework extends IScenery {
        /**
         * Animates an explosion of the Firework.
         * 
         * @param thing   The exploding Firework.
         */
        animate(thing: IFirework): void;
    }

    /**
     * General-purpose settings for macros.
     */
    export interface IMacroSettings {
        /**
         * The x-location (by default, 0).
         */
        x?: number;

        /**
         * The y-location (by default, 0).
         */
        y?: number;

        [i: string]: any;
    }

    /**
     * Settings for a FillPreThings macro.
     */
    export interface IMacroFillPreThingsSettings extends IMacroSettings {
        /**
         * The name of the Thing to fill, such as "Brick".
         */
        thing: string;

        /**
         * How many times to repeat the Thing horizontally to the
         * right (by default, 1).
         */
        xnum?: number;

        /**
         * How many times to repeat the Thing vertically upwards
         * (by default, 1).
         */
        ynum?: number;

        /**
         * How many units are between the left edges of placed
         * Things horizontally (by default, 0).
         */
        xwidth?: number;

        /**
         * How many units are between the top edges of placed
         * Things vertically (by default, 0).
         */
        yheight?: number;
    }

    /**
     * Settings for a FillPrePattern macro.
     */
    export interface IMacroFillPrePatternSettings extends IMacroSettings {
        /**
         * The name of the pattern to print, from the listing in
         * FSM.settings.maps.patterns.
         */
        pattern: string;

        /**
         * How many times to repeat the overall pattern (by 
         * default, 1).
         */
        repeat?: number;

        /**
         * Numbered items to skip, if any.
         */
        skips?: number[];
    }

    /**
     * Settings for a Floor macro.
     */
    export interface IMacroFloorSettings extends IMacroSettings {
        /**
         * How wide the Floor should be (by default, 8).
         */
        width?: number;
    }

    /**
     * Settings for a Pipe macro.
     */
    export interface IMacroPipeSettings extends IMacroSettings {
        /**
         * How high the Pipe should be, as a Number or "Infinity"
         * (by default, 8).
         */
        height?: number | string;

        /**
         * Whether there should be a Piranha spawning with the
         * Pipe (by default, false).
         */
        piranha?: boolean;

        /**
         * What location the Pipe should transport to (by default,
         * none).
         */
        transport?: any;

        /**
         * What location the Pipe should act as an entrance to (by
         * default, none).
         */
        entrance?: any;
    }

    /**
     * Settings for a PipeCorner macro.
     */
    export interface IMacroPipeCornerSettings extends IMacroSettings {
        /**
         * How high the Pipe should be (by default, 8).
         */
        height: number;

        /**
         * What location the Pipe should transport to (by default,
         * none).
         */
        transport?: any;

        /**
         * Whether there should be a ScrollEnabler placed on top of
         * the PipeVertical (by default, false).
         */
        scrollEnabler?: boolean;

        /**
         * Whether there should be a ScrollBlocker placed on top of
         * the PipeVertical (by default, false).
         */
        scrollBlocker?: boolean;
    }

    /**
     * Settings for a Tree macro.
     */
    export interface IMacroTreeSettings extends IMacroSettings {
        /**
         * How wide the Tree should be (preferably a multiple of 8).
         */
        width: number;

        /**
         * Whether the trunk scenery should be listed in the Solids
         * group instead of Scenery, to keep it in front of clouds
         * (by default, false).
         */
        solidTrunk?: boolean;
    }

    /**
     * Settings for a Shroom macro.
     */
    export interface IMacroShroomSettings extends IMacroSettings {
        /**
         * How wide the Shroom should be (preferably a multiple of 8).
         */
        width: number;

        /**
         * Whether the trunk scenery should be listed in the Solids
         * group instead of Scenery, to keep it in front of clouds
         * (by default, false).
         */
        solidTrunk?: boolean;
    }

    /**
     * Settings for a Water macro.
     */
    export interface IMacroWaterSettings extends IMacroSettings {
        /**
         * How wide the Water should be.
         */
        width: number;
    }

    /**
     * Settings for a Ceiling macro.
     */
    export interface IMacroCeilingSettings extends IMacroSettings {
        /**
         * How wide the ceiling should be.
         */
        width: number;
    }

    /**
     * Settings for a Bridge macro.
     */
    export interface IMacroBridgeSettings extends IMacroSettings {
        /**
         * How wide the bridge should be (by default, 16).
         */
        width?: number;

        /**
         * Whether the first 8 units should be taken up by an infinitely
         * high Stone column (by default, false).
         */
        begin?: boolean;

        /**
         * Whether the last 8 units should be taken up by an infinitely
         * high Stone column (by default, false).
         */
        end?: boolean;
    }

    /**
     *
     */
    export interface IMacroScaleSettings extends IMacroSettings {
        /**
         * How wide the left Platform should be (by default, 24).
         */
        widthLeft?: number;

        /**
         * How wide the right Platform should be (by default, 24).
         */
        widthRight?: number;

        /**
         * How much space there should be between Platforms (by
         * default, 40).
         */
        between?: number;

        /**
         * How far down from y the left Platform should start (by
         * default, 24).
         */
        dropLeft?: number;

        /**
         * How far down from y the right Platform should start (by
         * default, 24).
         */
        dropRight?: number;
    }

    /**
     * Settings for a PlatformGenerator macro.
     */
    export interface IMacroPlatformGeneratorSettings extends IMacroSettings {
        /**
         * What direction to travel, as -1 for up or 1 for down (by 
         * default, 1).
         */
        direction?: number;

        /**
         * How wide the Platforms should be (by default, 16).
         */
        width?: number;
    }

    /**
     * Settings for a WarpWorld macro.
     */
    export interface IMacroWarpWorldSettings extends IMacroSettings {
        /**
         * Names of maps the Pipes should warp to, in order.
         */
        warps: string[];

        /**
         * How far above the Piranhas to place the CustomText labels
         * (by default, 8).
         */
        textHeight?: number;
    }

    /**
     * Settings for a CheepsStart macro.
     */
    export interface IMacroCheepsStartSettings extends IMacroSettings {
        /**
         * How wide the detector should be (by default, 8).
         */
        width?: number;
    }

    /**
     * Settings for a CheepsStop macro.
     */
    export interface IMacroCheepsStopSettings extends IMacroSettings {
        /**
         * How wide the detector should be (by default, 8).
         */
        width?: number;
    }

    /**
     * Settings for a BulletBillsStart macro.
     */
    export interface IMacroBulletBillsStartSettings extends IMacroSettings {
        /**
         * How wide the detector should be (by default, 8).
         */
        width?: number;
    }

    /**
     * Settings for a BulletBillsStop macro.
     */
    export interface IMacroBulletBillsStopSettings extends IMacroSettings {
        /**
         * How wide the detector should be (by default, 8).
         */
        width?: number;
    }

    /**
     * Settings for a LakituStop macro.
     */
    export interface IMacroLakituStopSettings extends IMacroSettings {
        /**
         * How wide the detector should be (by default, 8).
         */
        width?: number;
    }

    /**
     * Settings for a CastleSmall or CastleLarge macro.
     */
    export interface IMacroCastleSettings extends IMacroSettings {
        /**
         * What map or location to shift to after ending theatrics.
         */
        transport: any;

        /**
         * How many CastleWalls should be placed to the right of the castle
         * (by default, 2).
         */
        walls?: number;
    }

    /**
     * Settings for a StartInsideCastle macro.
     */
    export interface IMacroStartInsideCastleSettings extends IMacroSettings {
        /**
         * How wide the starting zone should be (by default, 40).
         */
        width?: number;
    }

    /**
     * Settings for an EndOutsideCastle macro.
     */
    export interface IMacroEndOutsideCastleSettings extends IMacroSettings {
        /**
         * Where to transport to after ending theatrics.
         */
        transport: any;

        /**
         * Whether this should place a large castle instead of a small
         * (by default, false).
         */
        large?: boolean;

        /**
         * How far from the flagpole to the castle (by default, 24 for large
         * castles and 32 for small).
         */
        castleDistance?: number;

        /**
         * For large castles, how many CastleWall Things should be placed
         * after (by default, 2).
         */
        walls?: number;
    }

    /**
     *
     */
    export interface IMacroEndInsideCastleSettings extends IMacroSettings {
        /**
         * Where to transport to after ending theatrics.
         */
        transport: any;

        /**
         * Which NPC to use, as "Toach" or "Peach" (by default, "Toad").
         */
        npc?: string;

        /**
         * Whether Bowser should be in "hard" mode (by default, false).
         */
        hard?: boolean;

        /**
         * What Bowser's spawnType should be (by default, "Goomba").
         */
        spawnType?: string;

        /**
         * Whether Bowser is also throwing hammers (by default, false).
         */
        throwing?: boolean;

        /**
         * Whether a ScrollEnabler should be added above (by default, false).
         */
        topScrollEnabler?: boolean;
    }

    /**
     * Settings for a SectionPass macro.
     */
    export interface IMacroSectionPassSettings extends IMacroSettings {
        /**
         * How wide the detector should be (by default, 8).
         */
        width?: number;

        /**
         * How high the detector should be (by default, 8).
         */
        height?: number;
    }

    /**
     * Settings for a SectionFail macro.
     */
    export interface IMacroSectionFailSettings extends IMacroSettings {
        /**
         * How wide the detector should be (by default, 8).
         */
        width?: number;

        /**
         * How high the detector should be (by default, 8).
         */
        height?: number;
    }

    /**
     * Settings for a SectionDecider macro.
     */
    export interface IMacroSectionDeciderSettings extends IMacroSettings {
        /**
         * Which section to spawn if passed (by default, 0).
         */
        pass?: number;

        /**
         * Which section to spawn if failed (by default, 0).
         */
        fail?: number;
    }

    /**
     * Settings for a Section macro.
     */
    export interface IMacroSectionSettings extends IMacroSettings {
        /**
         * Which of the Area's sections to spawn (by default, 0).
         */
        section?: number;
    }

    /**
     * Settings regarding maps, particularly for AreaSpawnr, MapScreenr,
     * and MapsCreatr.
     */
    export interface IMapCustoms extends GameStartr.IMapCustoms {
        /**
         * Named patterns of Things and positions.
         */
        patterns: {
            [i: string]: [string, number, number];
        };
    }

    /**
     * Stored settings to be stored separately and kept within FullScreenMario.
     */
    export interface IFullScreenMarioStoredSettings extends GameStartr.IGameStartrStoredSettings {
        /**
         * Settings regarding maps, particularly for an IAreaSpawnr, an
         * IMapScreenr, and an IMapsCreatr.
         */
        maps: IMapCustoms;
    }

    /**
     * A free HTML5 remake of Nintendo's original Super Mario Bros, expanded for the
     * modern web. It includes the original 32 levels, a random map generator, a 
     * level editor, and over a dozen custom mods.
     */
    export interface IFullScreenMario extends GameStartr.IGameStartr {
        MapScreener: IMapScreenr;
        settings: IFullScreenMarioStoredSettings;
        unitsize: number;
        pointLevels: number[];
        customTextMappings: { [i: string]: string };
        player: IPlayer;
        deviceMotionStatus: IDeviceMotionStatus;
        gameStart(): void;
        gameOver(): void;
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void;
        addPreThing(prething: IPreThing): void;
        addPlayer(left?: number, bottom?: number): IPlayer;
        scrollPlayer(dx: number, dy?: number): void;
        onGamePause(FSM: IFullScreenMario): void;
        onGamePlay(FSM: IFullScreenMario): void;
        keyDownLeft(FSM: IFullScreenMario, event?: Event): void;
        keyDownRight(FSM: IFullScreenMario, event?: Event): void;
        keyDownUp(FSM: IFullScreenMario, event?: Event): void;
        keyDownDown(FSM: IFullScreenMario, event?: Event): void;
        keyDownSprint(FSM: IFullScreenMario, event?: Event): void;
        keyDownPause(FSM: IFullScreenMario, event?: Event): void;
        keyDownMute(FSM: IFullScreenMario, event?: Event): void;
        keyUpLeft(FSM: IFullScreenMario, event?: Event): void;
        keyUpRight(FSM: IFullScreenMario, event?: Event): void;
        keyUpUp(FSM: IFullScreenMario, event?: Event): void;
        keyUpDown(FSM: IFullScreenMario, event?: Event): void;
        keyUpSprint(FSM: IFullScreenMario, event?: Event): void;
        keyUpPause(FSM: IFullScreenMario, event?: Event): void;
        mouseDownRight(FSM: IFullScreenMario, event?: Event): void;
        deviceMotion(FSM: IFullScreenMario, event: DeviceMotionEvent): void;
        canInputsTrigger(FSM: IFullScreenMario): boolean;
        maintainTime(FSM: IFullScreenMario): boolean;
        maintainScenery(FSM: IFullScreenMario): void;
        maintainSolids(FSM: IFullScreenMario, solids: ISolid[]): void;
        maintainCharacters(FSM: IFullScreenMario, characters: ICharacter[]): void;
        maintainOverlaps(character: ICharacterOverlapping): void;
        setOverlapBoundaries(thing: ICharacterOverlapping): boolean;
        maintainPlayer(FSM: IFullScreenMario): void;
        generateCanThingCollide(): (thing: IThing) => boolean;
        isThingAlive(thing: IThing): boolean;
        isThingTouchingThing(thing: IThing, other: IThing): boolean;
        isThingOnThing(thing: IThing, other: IThing): boolean;
        isThingOnSolid(thing: IThing, other: IThing): boolean;
        isCharacterOnSolid(thing: ICharacter, other: ISolid): boolean;
        isCharacterOnResting(thing: ICharacter, other: ISolid): boolean;
        generateIsCharacterTouchingCharacter(): (thing: ICharacter, other: ICharacter) => boolean;
        generateIsCharacterTouchingSolid(): (thing: ICharacter, other: ISolid) => boolean;
        isCharacterAboveEnemy(thing: ICharacter, other: ICharacter): boolean;
        isCharacterBumpingSolid(thing: ICharacter, other: ISolid): boolean;
        isCharacterOverlappingSolid(thing: ICharacter, other: ISolid): boolean;
        isSolidOnCharacter(thing: ISolid, other: ICharacter): boolean;
        gainLife(amount: number, nosound?: boolean): void;
        itemJump(thing: IThing): void;
        jumpEnemy(thing: IPlayer, other: IEnemy): void;
        playerShroom(thing: IPlayer, other: IItem): void;
        playerShroom1Up(thing: ICharacter, other: IItem): void;
        playerStarUp(thing: IPlayer, timeout?: number): void;
        playerStarDown(thing: IPlayer): void;
        playerStarOffCycle(thing: IPlayer): void;
        playerStarOffFinal(thing: IPlayer): void;
        playerGetsBig(thing: IPlayer, noAnimation?: boolean): void;
        playerGetsBigAnimation(thing: IPlayer): void;
        playerGetsSmall(thing: IPlayer): void;
        playerGetsFire(thing: IPlayer): void;
        setPlayerSizeSmall(thing: IPlayer): void;
        setPlayerSizeLarge(thing: IPlayer): void;
        animatePlayerRemoveCrouch(thing: IPlayer): void;
        unattachPlayer(thing: IPlayer, other: ISolid): void;
        playerAddRestingStone(thing: IPlayer): void;
        markOverlap(thing: ICharacterOverlapping, other: ISolid): void;
        spawnDeadGoomba(thing: IThing): void;
        spawnHammerBro(thing: IHammerBro): void;
        spawnBowser(thing: IBowser): void;
        spawnPiranha(thing: IPiranha): void;
        spawnBlooper(thing: IBlooper): void;
        spawnPodoboo(thing: IPodoboo): void;
        spawnLakitu(thing: ILakitu): void;
        spawnCannon(thing: ICannon): void;
        spawnCastleBlock(thing: ICastleBlock): void;
        spawnMoveFloating(thing: IThingFloating): void;
        spawnMoveSliding(thing: IThingSliding): void;
        spawnScalePlatform(thing: IPlatform): void;
        spawnRandomCheep(FSM: IFullScreenMario): boolean;
        spawnRandomBulletBill(FSM: IFullScreenMario): boolean;
        spawnCustomText(thing: ICustomText): void;
        spawnDetector(thing: IDetector): void;
        spawnScrollBlocker(thing: IScrollBlocker): void;
        spawnCollectionComponent(collection: any, thing: IThing): void;
        spawnRandomSpawner(thing: IRandomSpawner): void;
        activateCheepsStart(thing: IDetector): void;
        activateCheepsStop(thing: IDetector): void;
        activateBulletBillsStart(thing: IDetector): void;
        activateBulletBillsStop(thing: IDetector): void;
        activateLakituStop(thing: IDetector): void;
        activateWarpWorld(thing: ICharacter, other: IDetectCollision): void;
        activateRestingStone(thing: IRestingStone, other: IPlayer): void;
        activateWindowDetector(thing: IDetectWindow): void;
        activateScrollBlocker(thing: IScrollBlocker): void;
        activateScrollEnabler(thing: IDetectCollision): void;
        activateSectionBefore(thing: ISectionDetector): void;
        activateSectionStretch(thing: ISectionDetector): void;
        activateSectionAfter(thing: ISectionDetector): void;
        generateHitCharacterSolid(): (thing: ICharacter, other: ISolid) => void;
        generateHitCharacterCharacter(): (thing: ICharacter, other: ICharacter) => void;
        collideFriendly(thing: ICharacter, other: IItem): void;
        collideCharacterSolid(thing: ICharacter, other: ISolid): void;
        collideCharacterSolidUp(thing: ICharacter, other: ISolid): void;
        collideUpItem(thing: IItem, other: ISolid): void;
        collideUpCoin(thing: ICoin, other: ISolid): void;
        collideCoin(thing: IPlayer, other: ICoin): void;
        collideStar(thing: IPlayer, other: IStar): void;
        collideFireball(thing: ICharacter, other: IFireball): void;
        collideCastleFireball(thing: ICharacter, other: ICastleFireball): void;
        collideShell(thing: ICharacter, other: IShell): void;
        collideShellSolid(thing: ISolid, other: IShell): void;
        collideShellPlayer(thing: IPlayer, other: IShell): void;
        collideShellShell(thing: IShell, other: IShell): void;
        collideEnemy(thing: ICharacter, other: IEnemy): void;
        collideBottomBrick(thing: IBrick, other: ICharacter): void;
        collideBottomBlock(thing: IBlock, other: IPlayer): void;
        collideVine(thing: IPlayer, other: IVine): void;
        collideSpringboard(thing: ICharacter, other: ISpringboard): void;
        collideWaterBlocker(thing: ICharacter, other: ISolid): void;
        collideFlagpole(thing: IPlayer, other: IDetectCollision): void;
        collideCastleAxe(thing: IPlayer, other: ICastleAxe): void;
        collideCastleDoor(thing: IPlayer, other: IDetectCollision): void;
        collideCastleNPC(thing: IPlayer, other: IDetectCollision): void;
        collideTransport(thing: IPlayer, other: ISolid): void;
        collideDetector(thing: ICharacter, other: IDetectCollision): void;
        collideLevelTransport(thing: IPlayer, other: ISolid): void;
        moveSimple(thing: ICharacter): void;
        moveSmart(thing: ICharacter): void;
        moveJumping(thing: ICharacter): void;
        movePacing(thing: IHammerBro | ILakitu): void;
        moveHammerBro(thing: IHammerBro): void;
        moveBowser(thing: IBowser): void;
        moveBowserFire(thing: IBowserFire): void;
        moveFloating(thing: IThingFloating): void;
        moveSliding(thing: IThingSliding): void;
        setMovementEndpoints(thing: IThingFloating | IThingSliding): void;
        movePlatform(thing: IPlatform): void;
        movePlatformSpawn(thing: IPlatform): void;
        moveFalling(thing: IPlatform): void;
        moveFreeFalling(thing: IPlatform): void;
        movePlatformScale(thing: IPlatform): void;
        moveVine(thing: IVine): void;
        moveSpringboardUp(thing: ISpringboard): void;
        moveShell(thing: IShell): void;
        movePiranha(thing: IPiranha): void;
        movePiranhaLatent(thing: IPiranha): void;
        moveBubble(thing: IThing): void;
        moveCheepCheep(thing: IThing): void;
        moveCheepCheepFlying(thing: IThing): void;
        moveBlooper(thing: IBlooper): void;
        moveBlooperSqueezing(thing: IBlooper): void;
        movePodobooFalling(thing: IPodoboo): void;
        moveLakitu(thing: ILakitu): void;
        moveLakituInitial(thing: ILakitu): void;
        moveLakituFleeing(thing: ILakitu): void;
        moveCoinEmerge(thing: ICoin, parent?: ISolid): void;
        movePlayer(thing: IPlayer): void;
        movePlayerVine(thing: IPlayer): void;
        movePlayerSpringboardDown(thing: IPlayer): void;
        animateSolidBump(thing: ISolid): void;
        animateBlockBecomesUsed(thing: IBlock): void;
        animateSolidContents(thing: IBrick | IBlock, other: IPlayer): ICharacter;
        animateBrickShards(thing: IBrick): void;
        animateEmerge(thing: ICharacter, other: ISolid): void;
        animateEmergeCoin(thing: ICoin, other: ISolid): void;
        animateEmergeVine(thing: IVine, solid: ISolid): void;
        animateFlicker(thing: IThing, cleartime?: number, interval?: number): void;
        animateThrowingHammer(thing: IHammerBro, count: number): boolean;
        animateBowserJump(thing: IBowser): boolean;
        animateBowserFire(thing: IBowser): boolean;
        animateBowserFireOpen(thing: IBowser): boolean;
        animateBowserThrow(thing: IBowser): boolean;
        animateBowserFreeze(thing: IBowser): void;
        animateJump(thing: IHammerBro): boolean;
        animateBlooperUnsqueezing(thing: IBlooper): void;
        animatePodobooJumpUp(thing: IPodoboo): void;
        animatePodobooJumpDown(thing: IPodoboo): void;
        animateLakituThrowingSpiny(thing: ILakitu): boolean;
        animateSpinyEggHatching(thing: ISpinyEgg): void;
        animateFireballEmerge(thing: IFireball): void;
        animateFireballExplode(thing: IFireball, big?: number): void;
        animateFirework(thing: IFirework): void;
        animateCannonFiring(thing: ICannon): void;
        animatePlayerFire(thing: IPlayer): void;
        animateCastleBlock(thing: ICastleBlock, balls: ICastleFireball[]): void;
        animateCastleBridgeOpen(thing: ISolid): void;
        animateCastleChainOpen(thing: ISolid): void;
        animatePlayerPaddling(thing: IPlayer): void;
        animatePlayerLanding(thing: IPlayer): void;
        animatePlayerRestingOff(thing: IPlayer): void;
        animatePlayerBubbling(thing: IPlayer): void;
        animatePlayerRunningCycle(thing: IPlayer): void;
        animateCharacterPauseVelocity(thing: IThing, keepMovement?: boolean): void;
        animateCharacterResumeVelocity(thing: IThing, noVelocity?: boolean): void;
        animateCharacterHop(thing: ICharacter): void;
        animatePlayerPipingStart(thing: IPlayer): void;
        animatePlayerPipingEnd(thing: IPlayer): void;
        animatePlayerOffPole(thing: IPlayer, doRun?: boolean): void;
        animatePlayerOffVine(thing: IPlayer): void;
        lookTowardsThing(thing: ICharacter, other: IThing): void;
        lookTowardsPlayer(thing: ICharacter, big?: boolean): void;
        killNormal(thing: IThing): void;
        killFlip(thing: ICharacter, extra?: number): void;
        killSpawn(thing: ICharacter, big?: boolean): IThing;
        killReplace(thing: IThing, title: string, attributes?: any, attributesCopied?: string[]): IThing;
        killGoomba(thing: IGoomba, big?: boolean): void;
        killKoopa(thing: IKoopa, big?: boolean): ICharacter;
        killLakitu(thing: ILakitu): void;
        killBowser(thing: IBowser, big?: boolean): void;
        killToShell(thing: ICharacter, big?: number): IShell;
        killNPCs(): void;
        killBrick(thing: IBrick, other?: ICharacter): void;
        killPlayer(thing: IPlayer, big?: number): void;
        findScore(level: number): number;
        score(value: number, continuation?: boolean): void;
        scoreOn(value: number, thing: IThing, continuation?: boolean): void;
        scoreAnimateOn(text: IText, thing: IThing): void;
        scoreAnimate(thing: IThing, timeout?: number): void;
        scorePlayerShell(thing: IPlayer, other: IShell): void;
        scorePlayerFlag(thing: IThing, difference: number): number;
        getVolumeLocal(FSM: IFullScreenMario, xloc: number): number;
        getAudioThemeDefault(FSM: IFullScreenMario): string;
        setMap(name?: string | IFullScreenMario, location?: string | number): void;
        setLocation(name?: string | number): void;
        mapEntranceNormal(FSM: IFullScreenMario, location?: ILocation): void;
        mapEntrancePlain(FSM: IFullScreenMario, location?: ILocation): void;
        mapEntranceWalking(FSM: IFullScreenMario, location?: ILocation): void;
        mapEntranceCastle(FSM: IFullScreenMario): void;
        mapEntranceVine(FSM: IFullScreenMario): void;
        mapEntranceVinePlayer(FSM: IFullScreenMario, vine: IVine): void;
        mapEntrancePipeVertical(FSM: IFullScreenMario, location?: ILocation): void;
        mapEntrancePipeHorizontal(FSM: IFullScreenMario, location?: ILocation): void;
        mapEntranceRespawn(FSM: IFullScreenMario): void;
        mapExitPipeVertical(thing: IPlayer, other: IPipe): void;
        mapExitPipeHorizontal(thing: IPlayer, other: IPipe, shouldTransport?: boolean): void;
        initializeArea(): void;
        setAreaBackground(area: IArea): void;
        getAbsoluteHeight(yloc: number, correctUnitsize?: boolean): number;
        mapAddStretched(prething: string | MapsCreatr.IPreThingSettings): IThing;
        mapAddAfter(prething: string | MapsCreatr.IPreThingSettings): void;
        cutsceneFlagpoleStartSlidingDown(settings: any, FSM: IFullScreenMario): void;
        cutsceneFlagpoleHitBottom(settings: any, FSM: IFullScreenMario): void;
        cutsceneFlagpoleCountdown(settings: any, FSM: IFullScreenMario): void;
        cutsceneFlagpoleFireworks(settings: any, FSM: IFullScreenMario): void;
        cutsceneBowserVictoryCollideCastleAxe(settings: any, FSM: IFullScreenMario): void;
        cutsceneBowserVictoryCastleBridgeOpen(settings: any, FSM: IFullScreenMario): void;
        cutsceneBowserVictoryBowserFalls(settings: any, FSM: IFullScreenMario): void;
        cutsceneBowserVictoryDialog(FSM: IFullScreenMario, settings: any): void;
        macroFillPreThings(
            reference: IMacroFillPreThingsSettings,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroFillPrePattern(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroFloor(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroPipe(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroPipeCorner(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroTree(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroShroom(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroWater(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroCeiling(reference: any): any;
        macroBridge(reference: any): any;
        macroScale(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroPlatformGenerator(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroWarpWorld(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroCheepsStart(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroCheepsStop(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroBulletBillsStart(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroBulletBillsStop(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroLakituStop(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroCastleSmall(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroCastleLarge(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroStartInsideCastle(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroEndOutsideCastle(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroEndInsideCastle(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroSection(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroSectionPass(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroSectionFail(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        macroSectionDecider(
            reference: any,
            prethings: any[],
            area: MapsCreatr.IMapsCreatrArea,
            map: MapsCreatr.IMapsCreatrMap,
            scope: any): any;
        ensureCorrectCaller(current: any): FullScreenMario;
    }
}
