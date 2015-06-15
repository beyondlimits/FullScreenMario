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

    export interface IPreThingSettings extends MapsCreatr.IPreThingSettings { }

    export interface IThing extends GameStartr.IThing {

    }

    export interface ICustomText extends IThing {
        children: IThing[];
    }

    export interface IFullScreenMario extends GameStartr.IGameStartr {
        unitsize: number;
        pointLevels: number[];
        resetTimes: any[];
        player: IThing;
    }
}