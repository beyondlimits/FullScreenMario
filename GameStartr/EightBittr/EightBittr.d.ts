declare module EightBittr {
    export interface IEightBittrSettings {
        constantsSource?: any;
        constants?: string[];
        requirements?: any;
    }

    export interface IThing {
        EightBitter: IEightBittr;
        top: number;
        right: number;
        bottom: number;
        left: number;
        width: number;
        height: number;
        xvel: number;
        yvel: number;
    }

    export interface IEightBittr {
        unitsize: number;
        checkRequirements(scope: any, requirements: any, name: string): void;
        reset(EightBitter: IEightBittr, resets: string[], customs?: any): void;
        resetTimed(EightBitter: IEightBittr, resets: string[], customs?: any): any[];
        get(name: any): Function;
        createCanvas(width: number, height: number, scaling?: number): HTMLCanvasElement;
        shiftVert(thing: IThing, dy: number): void;
        shiftHoriz(thing: IThing, dx: number): void;
        setTop(thing: IThing, top: number): void;
        setRight(thing: IThing, right: number): void;
        setBottom(thing: IThing, bottom: number): void;
        setLeft(thing: IThing, left: number): void;
        setMid(thing: IThing, x: number, y: number): void;
        setMidX(thing: IThing, x: number): void;
        setMidY(thing: IThing, y: number): void;
        getMidX(thing: IThing): number;
        getMidY(thing: IThing): number;
        setMidObj(thing: IThing, other: IThing): void;
        setMidXObj(thing: IThing, other: IThing): void;
        setMidYObj(thing: IThing, other: IThing): void;
        objectToLeft(thing: IThing, other: IThing): boolean;
        updateTop(thing: IThing, dy: number): void;
        updateRight(thing: IThing, dx: number): void;
        updateBottom(thing: IThing, dy: number): void;
        updateLeft(thing: IThing, dx: number): void;
        slideToX(thing: IThing, x: number, maxSpeed: number): void;
        slideToY(thing: IThing, y: number, maxSpeed: number): void;
        ensureCorrectCaller(current: any): IEightBittr;
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
        proliferateHard(recipient: any, donor: any, noOverride?: boolean): any;
        proliferateElement(recipient: HTMLElement, donor: any, noOverride?: boolean): HTMLElement;
        createElement(tag: string, ...args: any[]): HTMLElement;
        followPathHard(object: any, path: string[], num?: number): any;
        arraySwitch(thing: IThing, arrayOld: any[], arrayNew: any[]): void;
        arrayToBeginning(thing: IThing, array: any[]): void;
        arrayToEnd(thing: IThing, array: any[]): any;
    }
}