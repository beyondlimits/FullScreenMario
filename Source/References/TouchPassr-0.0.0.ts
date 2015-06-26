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
            left?: number | string;
            top?: number | string;
        }
    }

    export interface IControlSchema {
        name: string;
        control: string;
        position: IPosition;
        label?: string;
        styles?: any;
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
        degrees: number;
        neighbors?: string[];
        pipes?: IPipes;
    }

    export interface ITouchPassrSettings {
        InputWriter: InputWritr.IInputWritr;
        prefix?: string;
        container?: HTMLElement;
        styles?: any;
        controls?: { [i: string]: IControlSchema };
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
        protected elementInner: HTMLElement;

        /**
         * 
         */
        constructor(schema: IControlSchema, styles) {
            this.schema = schema;
            this.resetElement(styles);
        }

        /**
         * 
         */
        public getElement(): HTMLElement {
            return this.element;
        }

        /**
         * 
         */
        public getElementInner(): HTMLElement {
            return this.elementInner;
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
        public createElement(tag: string, ...args: any[]): HTMLElement {
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
        public proliferateElement(recipient: HTMLElement, donor: any, noOverride: boolean = false): HTMLElement {
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

        /**
         * 
         */
        protected resetElement(styles: any, customType?: string): void {
            var position = this.schema.position,
                offset = position.offset,
                customStyles;

            this.element = this.createElement("div", {
                "className": "control",
                "style": {
                    "position": "absolute",
                    "width": 0,
                    "height": 0,
                    "boxSizing": "border-box"
                }
            });
            this.elementInner = this.createElement("div", {
                "className": "control-inner",
                "textContent": this.schema.label,
                "style": {
                    "position": "absolute",
                    "boxSizing": "border-box"
                }
            });
            this.element.appendChild(this.elementInner);


            if (position.horizontal === "left") {
                this.element.style.left = "0";
            } else if (position.horizontal === "right") {
                this.element.style.right = "0";
            } else if (position.horizontal === "center") {
                this.element.style.left = "50%";
            }

            if (position.vertical === "top") {
                this.element.style.top = "0";
            } else if (position.vertical === "bottom") {
                this.element.style.bottom = "0";
            } else if (position.vertical === "center") {
                this.element.style.top = "50%";
            }

            this.passElementStyles(styles.default);
            this.passElementStyles(styles[customType]);
            this.passElementStyles(this.schema.styles);

            if (offset.left) {
                this.elementInner.style.marginLeft = this.createPixelMeasurement(offset.left);
            }

            if (offset.top) {
                this.elementInner.style.marginTop = this.createPixelMeasurement(offset.top);
            }

            // this glitch doe
            setTimeout(function () {
                if (position.horizontal === "center") {
                    this.elementInner.style.left = Math.round(this.elementInner.offsetWidth / -2) + "px";
                }
                if (position.vertical === "center") {
                    this.elementInner.style.top = Math.round(this.elementInner.offsetHeight / -2) + "px";
                }
            }.bind(this));
        }

        /**
         * 
         */
        protected createPixelMeasurement(raw: string | number): string {
            if (!raw) {
                return "0";
            }

            if (typeof raw === "number" || raw.constructor === Number) {
                return raw + "px";
            }

            return <string>raw;
        }

        /**
         * 
         */
        protected passElementStyles(styles): void {
            if (!styles) {
                return;
            }

            if (styles.element) {
                this.proliferateElement(this.element, styles.element);
            }

            if (styles.elementInner) {
                this.proliferateElement(this.elementInner, styles.elementInner);
            }
        }

        /**
         * 
         */
        protected setRotation(element: HTMLElement, rotation: number): void {
            element.style.transform = "rotate(" + rotation + "deg)";
        }
    }

    /**
     * 
     */
    export class ButtonControl extends Control {
        /**
         * 
         */
        protected resetElement(styles: any): void {
            super.resetElement(styles, "Button");
        }
    }

    /**
     * 
     */
    export class JoystickControl extends Control {
        /**
         * 
         */
        protected resetElement(styles: any): void {
            super.resetElement(styles, "Joystick");

            var directions: IJoystickDirection[] = (<IJoystickSchema>this.schema).directions,
                element: HTMLDivElement,
                degrees: number,
                dx: number,
                dy: number,
                i: number;

            for (i = 0; i < directions.length; i += 1) {
                degrees = directions[i].degrees;

                dx = Math.cos(degrees * Math.PI / 180) * 50 + 50;
                dy = Math.sin(degrees * Math.PI / 180) * 50 + 50;

                element = <HTMLDivElement>this.createElement("div", {
                    "className": "control-joystick-tick",
                    "style": {
                        "position": "absolute",
                        "left": dx + "%",
                        "top": dy + "%",
                        "marginLeft": "-4px",
                        "marginTop": "-1px",
                        "width": ".21cm",
                        "height": "2px",
                    }
                });

                this.proliferateElement(element, styles.Joystick.tick);
                this.setRotation(element, degrees);

                this.elementInner.appendChild(element);
            }
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
        private styles: any;

        /**
         * 
         */
        private controls: any;

        /**
         * 
         */
        private container: HTMLElement;
        
        /**
         * @param {ITouchPassrSettings} settings
         */
        constructor(settings: ITouchPassrSettings) {
            this.InputWriter = settings.InputWriter;
            this.styles = settings.styles || {};
            this.prefix = settings.prefix || "TouchPasser";

            this.resetContainer(settings.container);

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
                    control = new ButtonControl(schema, this.styles);
                    break;

                case "Joystick":
                    control = new JoystickControl(schema, this.styles);
                    break;
            }

            this.controls[schema.name] = control;
            this.container.appendChild(control.getElement());
        }


        /* HTML manipulations
        */

        /**
         * 
         */
        private resetContainer(parentContainer?: HTMLElement) {
            this.container = Control.prototype.createElement("div", {
                "className": "touch-passer-container",
                "style": {
                    "position": "absolute",
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                }
            });

            if (parentContainer) {
                parentContainer.appendChild(this.container);
            }
        }
    }
}
