/// <reference path="InputWritr-0.2.0.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * TouchPass is an in-progress module.
 * This means it doesn't yet exist as its own repository.
 * When it is ready, it will be spun off into its own repository on GitHub.
 */
var TouchPassr;
(function (_TouchPassr) {
    "use strict";
    /**
     *
     */
    var Control = (function () {
        /**
         *
         */
        function Control(schema) {
            this.schema = schema;
            this.resetElement();
        }
        /**
         *
         */
        Control.prototype.getElement = function () {
            return this.element;
        };
        /**
         *
         */
        Control.prototype.resetElement = function () {
            throw new Error("Control::resetElement is abstract.");
        };
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
        Control.prototype.createElement = function (tag) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var element = document.createElement(tag || "div"), i;
            for (i = 1; i < arguments.length; i += 1) {
                this.proliferateElement(element, arguments[i]);
            }
            return element;
        };
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
        Control.prototype.proliferateElement = function (recipient, donor, noOverride) {
            if (noOverride === void 0) { noOverride = false; }
            var setting, i, j;
            for (i in donor) {
                if (donor.hasOwnProperty(i)) {
                    // If noOverride, don't override already existing properties
                    if (noOverride && recipient.hasOwnProperty(i)) {
                        continue;
                    }
                    setting = donor[i];
                    switch (i) {
                        case "children":
                            if (typeof (setting) !== "undefined") {
                                for (j = 0; j < setting.length; j += 1) {
                                    recipient.appendChild(setting[j]);
                                }
                            }
                            break;
                        case "style":
                            this.proliferateElement(recipient[i], setting);
                            break;
                        default:
                            // If it's null, don't do anything (like .textContent)
                            if (setting === null) {
                                recipient[i] = null;
                            }
                            else if (typeof setting === "object") {
                                // If it's an object, recurse on a new version of it
                                if (!recipient.hasOwnProperty(i)) {
                                    recipient[i] = new setting.constructor();
                                }
                                this.proliferateElement(recipient[i], setting, noOverride);
                            }
                            else {
                                // Regular primitives are easy to copy otherwise
                                recipient[i] = setting;
                            }
                            break;
                    }
                }
            }
            return recipient;
        };
        return Control;
    })();
    _TouchPassr.Control = Control;
    /**
     *
     */
    var ButtonControl = (function (_super) {
        __extends(ButtonControl, _super);
        function ButtonControl() {
            _super.apply(this, arguments);
        }
        /**
         *
         */
        ButtonControl.prototype.resetElement = function () {
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
        };
        return ButtonControl;
    })(Control);
    _TouchPassr.ButtonControl = ButtonControl;
    /**
     *
     */
    var JoystickControl = (function (_super) {
        __extends(JoystickControl, _super);
        function JoystickControl() {
            _super.apply(this, arguments);
        }
        /**
         *
         */
        JoystickControl.prototype.resetElement = function () {
            this.element = this.createElement("div", {
                "class": "control control-joystick"
            });
        };
        return JoystickControl;
    })(Control);
    _TouchPassr.JoystickControl = JoystickControl;
    /**
     *
     */
    var TouchPassr = (function () {
        /**
         * @param {ITouchPassrSettings} settings
         */
        function TouchPassr(settings) {
            this.InputWriter = settings.InputWriter;
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
        TouchPassr.prototype.getInputWriter = function () {
            return this.InputWriter;
        };
        /**
         *
         */
        TouchPassr.prototype.getPrefix = function () {
            return this.prefix;
        };
        /* Controls shenanigans
        */
        /**
         *
         */
        TouchPassr.prototype.addControls = function (schemas) {
            var i;
            for (i in schemas) {
                if (schemas.hasOwnProperty(i)) {
                    this.addControl(schemas[i]);
                }
            }
        };
        /**
         *
         */
        TouchPassr.prototype.addControl = function (schema) {
            var control;
            switch (schema.control) {
                case "Button":
                    control = new ButtonControl(schema);
                    break;
                case "Joystick":
                    control = new JoystickControl(schema);
                    break;
            }
            this.controls[schema.name] = control;
            this.container.appendChild(control.getElement());
        };
        /* Container
        */
        /**
         *
         */
        TouchPassr.prototype.resetContainer = function (parentContainer) {
            this.container = Control.prototype.createElement("div", {
                "className": "touch-passer-container"
            });
            if (parentContainer) {
                parentContainer.appendChild(this.container);
            }
        };
        return TouchPassr;
    })();
    _TouchPassr.TouchPassr = TouchPassr;
})(TouchPassr || (TouchPassr = {}));
