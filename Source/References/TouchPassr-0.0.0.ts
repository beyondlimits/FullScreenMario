/// <reference path="InputWritr-0.2.0.ts" />

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

    export interface IButtonSchema extends IControlSchema {
        pipes?: IPipes;
    }

    export interface IJoystickSchema extends IControlSchema {
        directions: IJoystickDirection[];
    }

    export interface IJoystickDirection {
        name: string;
        neighbors?: string[];
        pipes?: IPipes;
    }

    export interface ITouchPassrSettings {
        InputWriter: InputWritr.IInputWritr;
        controls?: { [i: string]: IControlSchema };
        prefix?: string;
    }

    export interface ITouchPassr {

    }

    /**
     * 
     */
    export class Control {
        /**
         * 
         */
        protected schema: IControlSchema;

        /**
         * 
         */
        protected element: HTMLElement;

        /**
         * 
         */
        constructor(schema: IControlSchema) {
            this.schema = schema;
            this.resetElement();
        }

        /**
         * 
         */
        protected resetElement() {
            throw new Error("Control::resetElement is abstract.");
        }

        /**
         * Creates and returns an HTMLElement of the specified type. Any additional
         * settings Objects may be given to be proliferated onto the Element via
         * proliferateElement.
         * 
         * @param {String} type   The tag of the Element to be created.
         * @param {Object} [settings]   Additional settings for the Element, such as
         *                              className or style.
         * @return {HTMLElement}
         */
        createElement(tag: string, ...args: any[]): HTMLElement {
            var element: any = document.createElement(tag || "div"),
                i: number;

            // For each provided object, add those settings to the element
            for (i = 1; i < arguments.length; i += 1) {
                this.proliferateElement(element, arguments[i]);
            }

            return element;
        }

        /**
         * Identical to proliferate, but tailored for HTML elements because many
         * element attributes don't play nicely with JavaScript Array standards. 
         * Looking at you, HTMLCollection!
         * 
         * @param {HTMLElement} recipient
         * @param {Any} donor
         * @param {Boolean} [noOverride]
         * @return {HTMLElement}
         */
        proliferateElement(recipient: HTMLElement, donor: any, noOverride: boolean = false): HTMLElement {
            var setting: any,
                i: string,
                j: number;

            // For each attribute of the donor:
            for (i in donor) {
                if (donor.hasOwnProperty(i)) {
                    // If noOverride, don't override already existing properties
                    if (noOverride && recipient.hasOwnProperty(i)) {
                        continue;
                    }

                    setting = donor[i];

                    // Special cases for HTML elements
                    switch (i) {
                        // Children: just append all of them directly
                        case "children":
                            if (typeof (setting) !== "undefined") {
                                for (j = 0; j < setting.length; j += 1) {
                                    recipient.appendChild(setting[j]);
                                }
                            }
                            break;

                        // Style: proliferate (instead of making a new Object)
                        case "style":
                            this.proliferateElement(recipient[i], setting);
                            break;

                        // By default, use the normal proliferate logic
                        default:
                            // If it's null, don't do anything (like .textContent)
                            if (setting === null) {
                                recipient[i] = null;
                            } else if (typeof setting === "object") {
                                // If it's an object, recurse on a new version of it
                                if (!recipient.hasOwnProperty(i)) {
                                    recipient[i] = new setting.constructor();
                                }
                                this.proliferateElement(recipient[i], setting, noOverride);
                            } else {
                                // Regular primitives are easy to copy otherwise
                                recipient[i] = setting;
                            }
                            break;
                    }
                }
            }
            return recipient;
        }
    }

    /**
     * 
     */
    export class ButtonControl extends Control {
        /**
         * 
         */
        protected resetElement() {
            this.element = this.createElement("div", {
                "class": "control control-button",
                "textContent": this.schema.label,
                "style": {
                    "position": "absolute",
                    "width": "50px",
                    "height": "50px",
                    "border-radius": "100%",
                    "background": "rgba(175, 175, 175, .7)"
                }
            });
        }
    }

    /**
     * 
     */
    export class JoystickControl extends Control {
        /**
         * 
         */
        protected resetElement() {

        }
    }
    
    /**
     * 
     */
    export class TouchPassr implements ITouchPassr {
        /**
         * 
         */
        private InputWriter: InputWritr.IInputWritr;
        
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
            this.InputWriter = settings.InputWriter;
            this.prefix = settings.prefix || "TouchPasser";

            this.controls = {};
            if (settings.controls) {
                this.addControls(settings.controls);
            }
        }


        /* Simple gets
        */

        /**
         * 
         */
        getInputWriter(): InputWritr.IInputWritr {
            return this.InputWriter;
        }

        /**
         * 
         */
        getPrefix(): string {
            return this.prefix;
        }
        

        /* Controls shenanigans
        */

        /**
         * 
         */
        addControls(schemas: { [i: string]: IControlSchema }): void {
            var i: string;

            for (i in schemas) {
                if (schemas.hasOwnProperty(i)) {
                    this.addControl(schemas[i]);
                }
            }
        }

        /**
         * 
         */
        addControl(schema: IControlSchema): void {
            var control: Control;

            // @todo keep a mapping of control classes, not this switch statement
            switch (schema.control) {
                case "Button":
                    control = new ButtonControl(schema);
                    break;

                case "Joystick":
                    control = new JoystickControl(schema);
                    break;
            }

            this.controls[schema.name] = control;
        }
    }
}