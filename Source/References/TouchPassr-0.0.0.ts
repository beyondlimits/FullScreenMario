/**
 * TouchPass is an in-progress module.
 * This means it doesn't yet exist as its own repository.
 * When it is ready, it will be spun off into its own repository on GitHub.
 */
module TouchPassr {
    "use strict";

    export interface IPosition {
        vertical: string;
        horizontal: string;
        offset?: {
            left?: number;
            top?: number;
        }
    }

    export interface IControlSchema {
        name: string;
        control: string;
        position: IPosition;
        label?: string;
    }

    export interface IPipes {
        activated?: string[];
        deactivated?: string[];
    }

    export interface IButtonControl extends IControlSchema {
        pipes?: IPipes;
    }

    export interface IJoystickControl extends IControlSchema {
        directions: IJoystickDirection[];
    }

    export interface IJoystickDirection {
        name: string;
        neighbors?: string[];
        pipes?: IPipes;
    }

    export interface ITouchPassrSettings {
        controls: { [i: string]: IControlSchema };
        prefix?: string;
    }

    export interface ITouchPassr {

    }
    
    /**
     * 
     */
    export class TouchPassr implements ITouchPassr {
        
        /**
         * 
         */
        private prefix: string;

        /**
         * 
         */
        private controls: any;
        
        /**
         * @param {ITouchPassrSettings} settings
         */
        constructor(settings: ITouchPassrSettings) {
            
        }
    }
}