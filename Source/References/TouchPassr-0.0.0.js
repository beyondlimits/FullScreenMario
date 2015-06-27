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
        function Control(InputWriter, schema, styles) {
            this.InputWriter = InputWriter;
            this.schema = schema;
            this.resetElement(styles);
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
        Control.prototype.getElementInner = function () {
            return this.elementInner;
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
        /**
         *
         */
        Control.prototype.resetElement = function (styles, customType) {
            var position = this.schema.position, offset = position.offset, customStyles;
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
            }
            else if (position.horizontal === "right") {
                this.element.style.right = "0";
            }
            else if (position.horizontal === "center") {
                this.element.style.left = "50%";
            }
            if (position.vertical === "top") {
                this.element.style.top = "0";
            }
            else if (position.vertical === "bottom") {
                this.element.style.bottom = "0";
            }
            else if (position.vertical === "center") {
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
        };
        /**
         *
         */
        Control.prototype.createPixelMeasurement = function (raw) {
            if (!raw) {
                return "0";
            }
            if (typeof raw === "number" || raw.constructor === Number) {
                return raw + "px";
            }
            return raw;
        };
        /**
         *
         */
        Control.prototype.passElementStyles = function (styles) {
            if (!styles) {
                return;
            }
            if (styles.element) {
                this.proliferateElement(this.element, styles.element);
            }
            if (styles.elementInner) {
                this.proliferateElement(this.elementInner, styles.elementInner);
            }
        };
        /**
         *
         */
        Control.prototype.setRotation = function (element, rotation) {
            element.style.transform = "rotate(" + rotation + "deg)";
        };
        /**
         *
         */
        Control.prototype.onEvent = function (which, event) {
            var events = this.schema.pipes[which], i, j;
            if (!events) {
                return;
            }
            for (i in events) {
                if (!events.hasOwnProperty(i)) {
                    continue;
                }
                for (j = 0; j < events[i].length; j += 1) {
                    this.InputWriter.callEvent(i, events[i][j], event);
                }
            }
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
        ButtonControl.prototype.resetElement = function (styles) {
            var onActivated = this.onEvent.bind(this, "activated"), onDeactivated = this.onEvent.bind(this, "deactivated");
            _super.prototype.resetElement.call(this, styles, "Button");
            this.element.addEventListener("mousedown", onActivated);
            this.element.addEventListener("touchstart", onActivated);
            this.element.addEventListener("mouseup", onDeactivated);
            this.element.addEventListener("touchend", onDeactivated);
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
        JoystickControl.prototype.resetElement = function (styles) {
            _super.prototype.resetElement.call(this, styles, "Joystick");
            var directions = this.schema.directions, element, degrees, sin, cos, dx, dy, i;
            for (i = 0; i < directions.length; i += 1) {
                degrees = directions[i].degrees;
                // sin and cos are an amount / 1 the tick is offset from the center
                sin = Math.sin(degrees * Math.PI / 180);
                cos = Math.cos(degrees * Math.PI / 180);
                // dx and dy are measured as percent from the center, based on sin & cos
                dx = cos * 50 + 50;
                dy = sin * 50 + 50;
                element = this.createElement("div", {
                    "className": "control-joystick-tick",
                    "style": {
                        "position": "absolute",
                        "left": dx + "%",
                        "top": dy + "%",
                        "marginLeft": (-cos * 5 - 5) + "px",
                        "marginTop": (-sin * 2 - 1) + "px"
                    }
                });
                this.proliferateElement(element, styles.Joystick.tick);
                this.setRotation(element, degrees);
                this.elementInner.appendChild(element);
            }
            // In addition to the ticks, a drag element shows current direction
            this.elementDragger = this.createElement("div", {
                "className": "control-joystick-dragger",
                "style": {
                    "position": "absolute",
                    "opacity": "0",
                    "top": ".77cm",
                    "left": ".77cm"
                }
            });
            this.proliferateElement(this.elementDragger, styles.Joystick.dragger);
            this.elementInner.appendChild(this.elementDragger);
            this.element.addEventListener("touchstart", this.positionDraggerEnable.bind(this));
            this.element.addEventListener("mousedown", this.positionDraggerEnable.bind(this));
            this.element.addEventListener("touchend", this.positionDraggerDisable.bind(this));
            this.element.addEventListener("mouseout", this.positionDraggerDisable.bind(this));
            this.element.addEventListener("mouseup", this.positionDraggerDisable.bind(this));
            this.element.addEventListener("click", this.triggerDragger.bind(this));
            this.element.addEventListener("touchmove", this.triggerDragger.bind(this));
            this.element.addEventListener("mousemove", this.triggerDragger.bind(this));
        };
        /**
         *
         */
        JoystickControl.prototype.positionDraggerEnable = function () {
            this.dragEnabled = true;
            this.elementDragger.style.opacity = "1";
        };
        /**
         *
         */
        JoystickControl.prototype.positionDraggerDisable = function () {
            this.dragEnabled = false;
            this.elementDragger.style.opacity = "0";
        };
        /**
         *
         */
        JoystickControl.prototype.triggerDragger = function (event) {
            if (!this.dragEnabled) {
                return;
            }
            var x = event.x, y = event.y, offsets = this.getOffsets(this.elementInner), midX = offsets[0] + this.elementInner.offsetWidth / 2, midY = offsets[1] + this.elementInner.offsetHeight / 2, dxRaw = x - midX, dyRaw = y - midY, dTotal = Math.sqrt(dxRaw * dxRaw + dyRaw * dyRaw), thetaRaw = Math.atan(dyRaw / dxRaw) * 360 / Math.PI, direction = this.findClosestDirection(thetaRaw), theta = this.schema.directions[direction].degrees, dx = 77 * Math.cos(theta), dy = 77 * Math.sin(theta);
            this.proliferateElement(this.elementDragger, {
                "style": {
                    "marginLeft": dx + "%",
                    "marginTop": dy + "%"
                }
            });
            this.setRotation(this.elementDragger, theta * 180 / Math.PI);
        };
        /**
         *
         */
        JoystickControl.prototype.getOffsets = function (element) {
            var output;
            if (element.offsetParent && element !== element.offsetParent) {
                output = this.getOffsets(element.offsetParent);
                output[0] += element.offsetLeft;
                output[1] += element.offsetTop;
            }
            else {
                output = [element.offsetLeft, element.offsetTop];
            }
            return output;
        };
        /**
         *
         */
        JoystickControl.prototype.findClosestDirection = function (degrees) {
            var directions = this.schema.directions, difference = Math.abs(directions[0].degrees - degrees), record = 0, differenceTest, i;
            for (i = 1; i < directions.length; i += 1) {
                differenceTest = Math.abs(directions[i].degrees - degrees);
                if (differenceTest < difference) {
                    difference = differenceTest;
                    record = i;
                }
            }
            return record;
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
                    control = new ButtonControl(this.InputWriter, schema, this.styles);
                    break;
                case "Joystick":
                    control = new JoystickControl(this.InputWriter, schema, this.styles);
                    break;
            }
            this.controls[schema.name] = control;
            this.container.appendChild(control.getElement());
        };
        /* HTML manipulations
        */
        /**
         *
         */
        TouchPassr.prototype.resetContainer = function (parentContainer) {
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
        };
        return TouchPassr;
    })();
    _TouchPassr.TouchPassr = TouchPassr;
})(TouchPassr || (TouchPassr = {}));
