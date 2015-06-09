declare module LevelEditr {
    export interface IGameStartr {
        GroupHolder: GroupHoldr.IGroupHoldr;
        InputWriter: InputWritr.IInputWritr;
        MapsCreator: MapsCreatr.IMapsCreatr;
        MapScreener: MapScreenr.IMapScreenr;
        MapsHandler: MapsHandlr.IMapsHandlr;
        ObjectMaker: ObjectMakr.IObjectMakr;
        PixelDrawer: PixelDrawr.IPixelDrawr;
        StatsHolder: StatsHoldr.IStatsHoldr;
        TimeHandler: TimeHandlr.ITimeHandlr;
        player: IThing;
        container: HTMLDivElement;
        unitsize: number;
        addPageStyles(styles: any): void;
        addThing(thing: IThing, x?: number, y?: number): IThing;
        createElement(tag: "a", ...args: any[]): HTMLLinkElement;
        createElement(tag: "div", ...args: any[]): HTMLDivElement;
        createElement(tag: "input", ...args: any[]): HTMLInputElement;
        createElement(tag: "select", ...args: any[]): HTMLSelectElement;
        createElement(tag: string, ...args: any[]): HTMLElement;
        killNormal(thing: IThing): void;
        proliferateElement(recipient: HTMLElement, donor: any, noOverride?: boolean): void;
        setLeft(thing: IThing, left: number): void;
        setMap(name: string, location?: string): void;
        setRight(thing: IThing, right: number): void;
        setTop(thing: IThing, top: number): void;
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
        scrollWindow(x: number): void;
    }

    export interface IThing extends PixelDrawr.IThing, MapsCreatr.IThing {
        width: number;
        height: number;
        outerok: boolean;
    }

    export interface IPreThing {
        thing: IThing;
        xloc: number;
        yloc: number;
        title?: string;
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
        reference?: any;
    }

    export interface IPreThingHolder {
        [i: string]: IPreThing[];
    }

    export interface IMapsCreatrMapRaw extends MapsCreatr.IMapsCreatrMapRaw {
        time: number;
    }

    export interface IMapsCreatrAreaRaw extends MapsCreatr.IMapsCreatrAreaRaw {
        setting?: string;
    }

    export interface IDataMouseEvent extends MouseEvent {
        dataTransfer: DataTransfer;
    }

    export interface IDataProgressEvent extends ProgressEvent {
        currentTarget: IDataEventTarget;
    }

    export interface IDataEventTarget extends EventTarget {
        result: string;
    }

    export interface IThingIcon extends HTMLDivElement {
        options: any[];
    }

    export interface IDisplayContainer {
        "container": HTMLDivElement;
        "scrollers": {
            "container": HTMLDivElement;
            "left": HTMLDivElement;
            "right": HTMLDivElement;
        };
        "gui": HTMLDivElement;
        "head": HTMLDivElement;
        "namer": HTMLInputElement;
        "minimizer": HTMLDivElement;
        "stringer": {
            "textarea": HTMLTextAreaElement;
            "messenger": HTMLDivElement;
        };
        "inputDummy": HTMLInputElement;
        "sections": {
            "ClickToPlace": {
                "container": HTMLDivElement;
                "Things": HTMLDivElement;
                "Macros": HTMLDivElement;
                "VisualSummary": HTMLDivElement;
                "VisualOptions": HTMLDivElement;
            };
            "MapSettings": {
                "container": HTMLDivElement;
                "Time": HTMLSelectElement;
                "Setting": {
                    "Primary": HTMLSelectElement;
                    "Secondary": HTMLSelectElement;
                    "Tertiary": HTMLSelectElement;
                };
                "Area": HTMLSelectElement;
                "Location": HTMLSelectElement;
                "Entry": HTMLSelectElement;
            };
            "JSON": HTMLDivElement;
            "buttons": {
                "ClickToPlace": {
                    "container": HTMLDivElement;
                    "Things": HTMLDivElement;
                    "Macros": HTMLDivElement;
                };
                "MapSettings": HTMLDivElement;
                "JSON": HTMLDivElement;
            }
        }
    }

    export interface ILevelEditrSettings {
        GameStarter: IGameStartr;
        prethings: { [i: string]: IPreThing[] };
        thingGroups: string[];
        thingKeys: string[];
        macros: { [i: string]: MapsCreatr.IMapsCreatrMacro };
        beautifier: (text: string) => string;
        mapNameDefault?: string;
        mapTimeDefault?: number;
        mapSettingDefault?: string;
        mapEntryDefault?: string;
        mapDefault?: IMapsCreatrMapRaw;
        blocksize?: number;
        keyUndefined?: string;
    }

    export interface ILevelEditr {
        enable(): void;
        disable(): void;
        minimize(): void;
        maximize(): void;
        startBuilding(): void;
        startPlaying(): void;
        downloadCurrentJSON(): void;
        setCurrentJSON(json: string): void;
        loadCurrentJSON(): void;
    }
}