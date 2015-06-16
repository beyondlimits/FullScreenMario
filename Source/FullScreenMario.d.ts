declare module FullScreenMario {
    export interface IMapScreenr extends MapScreenr.IMapScreenr {
        nokeys: boolean;
        notime: boolean;
        canscroll: boolean;
        underwater: boolean;
        floor: number;
    }

    export interface IArea extends MapsCreatr.IMapsCreatrArea {
        background: string;
        time: number;
        attributes?: {
            [i: string]: any;
        }
        setBackground: (area: IArea) => void;
    }

    export interface ILocation extends MapsCreatr.IMapsCreatrLocation {
        xloc: number;
        entrance?: IThing;
    }

    export interface IDeviceMotionStatus {
        motionDown: boolean;
        motionLeft: boolean;
        motionRight: boolean;
        x: number;
        y: number;
        dy: number;
    }

    export interface IPreThingSettings extends MapsCreatr.IPreThingSettings { }

    export interface IPreThing extends MapsCreatr.IPreThing {
        thing: IThing;
    }

    export interface IThing extends GameStartr.IThing {
        FSM: IFullScreenMario;
        alive: boolean;
        collectionPartnerNames?: string[];
        dead?: boolean;
        flickering?: boolean;
        numquads: number;
        partners?: { [i: string]: IThing };
        position?: string;
        tolx: number;
        toly: number;
    }

    export interface IThingFloating extends IThing {
        begin: number;
        end: number;
        maxvel: number;
    }

    export interface IThingSliding extends IThing {
        begin: number;
        end: number;
        maxvel: number;
    }

    export interface ICustomText extends IThing {
        children: IText[];
        size: number;
        spacingHorizontal: number;
        spacingVertical: number;
        spacingVerticalBlank: number;
        textAttributes?: any;
        texts: ICustomTextInfo[];
    }

    export interface ICustomTextInfo {
        text: string;
        offset: number;
    }

    export interface IText extends IThing { }

    export interface ISolid extends IThing {
        actionLeft? (thing: ICharacter, other: ISolid, transport?: any): void;
        actionTop? (thing: ICharacter, other: ISolid, transport?: any): void;
        attachedCharacter?: ICharacter;
        bottomBump? (thing: ISolid, other: ICharacter): void;
        collide(thing: ICharacter, other: ISolid): void;
        collideHidden?: boolean;
        killonend?: boolean | { (thing: ISolid, group: ISolid[], i: number): void };
        onRestedUpon? (thing: ISolid, other: ICharacter): void;
        solid: boolean;
        transport?: any;
        up?: ICharacter;
    }

    export interface IBrick extends ISolid {
        breakable: boolean;
        contents?: string;
        lastcoin?: boolean;
        used: boolean;
    }

    export interface IBlock extends ISolid {
        contents: string;
        used: boolean;
    }

    export interface ICastleAxe extends ISolid { }

    export interface ICastleBlock extends ISolid {
        angle?: number;
        direction: number;
        dt?: number;
        fireballs: number;
        speed: number;
    }

    export interface IDetector extends ISolid {
        activate(thing: IThing): void;
    }

    export interface IDetectCollision extends IDetector {
        activateFail? (thing: ICharacter): void;
        activate(thing: ICharacter, other?: IDetectCollision): void;
        noActivateDeath?: boolean;
    }

    export interface IDetectWindow extends IDetector { }

    export interface ISectionDetector extends IDetectWindow {
        section: number;
    }

    export interface IRandomSpawner extends IDetector {
        "randomization": string;
        "randomTop": number;
        "randomRight": number;
        "randomBottom": number;
        "randomLeft": number;
        "randomWidth": number;
    }

    export interface IScrollBlocker extends IDetector {
        setEdge: boolean;
    }

    export interface IPipe extends ISolid { }

    export interface IPlatform extends ISolid {
        acceleration?: number;
        freefall?: boolean;
        fallThresholdStart?: number;
        fallThresholdEnd?: number;
        tension?: number;
        partners: {
            ownString: IThing;
            partnerString: IThing;
            partnerPlatform: IPlatform;
            [i: string]: IThing;
        }
    }

    export interface IRestingStone extends ISolid {
        activated: boolean;
    }

    export interface ISpringboard extends ISolid {
        heightNormal: number;
        tension: number;
        tensionSave?: number;
    }

    export interface IVine extends ISolid {
        attachedSolid: ISolid;
        speed: number;
    }

    export interface ICharacter extends IThing {
        allowUpSolids?: boolean;
        blockparent?: ISolid;
        animate? (thing: ICharacter, other?: ISolid): void;
        checkOverlaps?: boolean;
        collide? (thing: IThing, other: IThing): void;
        collidePrimary?: boolean;
        counter?: number;
        death(thing: IThing, severity?: number): void;
        direction: boolean;
        emergeOut? (thing: ICharacter, other: ISolid): void;
        gravity?: number;
        group: string;
        hopping?: boolean;
        jumpheight?: number;
        lookleft: boolean;
        killonend? (thing: IThing): void;
        player?: boolean;
        moveleft: boolean;
        nocollidechar?: boolean;
        nocollideplayer?: boolean;
        nocollidesolid?: boolean;
        nofire?: number;
        nofiredeath?: boolean;
        noflip?: boolean;
        nokillend?: boolean;
        nomove?: boolean;
        onCollideUp? (thing: ICharacter, other: ISolid): void;
        onResting? (thing: ICharacter, other: ISolid): void;
        resting?: ISolid;
        scoreBelow: number;
        scoreFire: number;
        scoreStar: number;
        shell?: boolean;
        shellspawn?: boolean;
        shelltype?: string;
        smart?: boolean;
        spawnType?: string;
        spawnSettings?: any;
        speed: number;
        type: string;
        undermid?: ISolid;
        onRestingOff? (character: ICharacter, other: ISolid): void;
        under?: ISolid[];
    }

    export interface ICharacterOverlapping extends ICharacter {
        overlapCheck: number;
        overlapGoal: number;
        overlapGoRight: boolean;
        overlaps: ISolid[];
    }

    export interface IBrickShard extends ICharacter { }

    export interface ICastleFireball extends ICharacter { }

    export interface IEnemy extends ICharacter {
        deadly?: boolean;
        nostar?: boolean;
        shell?: boolean;
    }

    export interface IBlooper extends IEnemy {
        squeeze: number;
        counter: number;
    }

    export interface IBowserFire extends IEnemy {
        ylev: number;
    }

    export interface IBulletBill extends IEnemy { }

    export interface ICannon extends IEnemy {
        frequency: number;
        noBullets?: boolean;
    }

    export interface ICheepCheep extends IEnemy {
        flying: boolean;
    }

    export interface IFireball extends IEnemy {

    }

    export interface IGoomba extends IEnemy { }

    export interface IHammerBro extends IEnemy {
        counter: number;
        falling: boolean;
    }

    export interface IBowser extends IHammerBro {
        deathcount: number;
        fireTimes: number[];
        jumpTimes: number[];
        nothrow: boolean;
        throwAmount?: number[];
        throwBetween?: number;
        throwDelay?: number;
        throwPeriod?: number;
        throwing: boolean;
    }

    export interface IKoopa extends IEnemy {
        jumping: boolean;
        floating: boolean;
    }

    export interface ILakitu extends IEnemy {
        fleeing?: boolean;
    }

    export interface IPiranha extends IEnemy {
        counter: number;
        countermax: number;
        onPipe: boolean;
    }

    export interface IPodoboo extends IEnemy {
        acceleration: number;
        frequency: number;
        jumpHeight: number;
        starty: number;
    }

    export interface ISpinyEgg extends IEnemy {

    }

    export interface ISpiny extends IEnemy {

    }

    export interface IItem extends ICharacter {
        action? (thing: IPlayer, other: IItem): void;
    }

    export interface ICoin extends IItem {
        animate(thing: ICoin, other: ISolid): void;
        blockparent?: ISolid;
    }

    export interface IShell extends IItem {
        counting: number;
        enemyhitcount: number;
        hitcount: number;
        landing: number;
        peeking: number;
        shelltoleft: boolean;
        smart?: boolean;
        spawnSettings?: {
            smart?: boolean;
        }
    }

    export interface IStar extends IItem {
        star: boolean;
    }

    export interface IPlayer extends ICharacter {
        animatedClimbing?: boolean;
        attachedDirection?: number;
        attachedLeft?: boolean;
        attachedSolid?: ISolid;
        attachedOff?: number;
        canjump?: boolean;
        climbing?: boolean;
        crouching: boolean;
        dying?: boolean;
        fire(player: IPlayer): void;
        getKeys(): IPlayerKeys;
        jumpcount: number;
        jumpers?: number; // wat
        jumping?: boolean;
        keys: IPlayerKeys;
        maxspeed: number;
        numballs: number;
        paddling?: boolean;
        paddlingCycle?: boolean;
        piping?: boolean;
        power: number;
        run: number;
        running: boolean;
        scrollspeed: number;
        skidding?: boolean;
        shrooming?: boolean;
        spring?: ISpringboard;
        star: boolean;
        swimming?: boolean;
        tolxOld?: number;
        tolyOld?: number;
        walkspeed: number;
    }

    export interface IPlayerKeys {
        crouch: boolean;
        jump: boolean;
        jumplev: number;
        leftDown?: boolean;
        piping: boolean;
        rightDown?: boolean;
        run: number;
        sprint: boolean;
        up: boolean;
    }

    export interface IScenery extends IThing { }

    export interface IFirework extends IScenery {
        animate(thing: IFirework): void;
    }

    export interface IFullScreenMario extends GameStartr.IGameStartr {
        settings: GameStartr.IGameStartrStoredSettings;
        unitsize: number;
        pointLevels: number[];
        resetTimes: any[];
        player: IPlayer;
        deviceMotionStatus: IDeviceMotionStatus;
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void;
        addPreThing(prething: IPreThing): void;
        addPlayer(left?: number, bottom?: number): void;
        onGamePause(FSM: FullScreenMario): void;
        onGamePlay(FSM: FullScreenMario): void;
        keyDownLeft(player: IPlayer, event: Event): void;
        keyDownRight(player: IPlayer, event: Event): void;
        keyDownUp(player: IPlayer, event: Event): void;
        keyDownDown(player: IPlayer, event: Event): void;
        keyDownSprint(player: IPlayer, event: Event): void;
        keyDownPause(player: IPlayer, event: Event): void;
        keyDOwnMute(player: IPlayer, event: Event): void;
        keyUpLeft(player: IPlayer, event: Event): void;
        keyUpRight(player: IPlayer, event: Event): void;
        keyUpUp(player: IPlayer, event: Event): void;
        keyUpDown(player: IPlayer, event: Event): void;
        keyUpSprint(player: IPlayer, event: Event): void;
        keyUpPause(player: IPlayer, event: Event): void;
        mouseDownRight(player: IPlayer, event: Event): void;
        deviceMotion(player: IPlayer, event: DeviceMotionEvent): void;
        canInputsTrigger(FSM: FullScreenMario): boolean;
        maintainSolids(FSM: FullScreenMario, solids: IThing[]): void;
        maintainCharacters(FSM, characters: ICharacter[]): void;
        maintainOverlaps(character: ICharacterOverlapping): void;
        setOverlapBoundaries(thing: ICharacterOverlapping): void;
        maintainPlayer(FSM: FullScreenMario): void;
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
        isSolidOnCharacter(thing: ICharacter, other: ISolid): boolean;
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






    }
}