/// <reference path="InputWritr-0.2.0.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * TouchPassr is an in-progress module.
 * This means it doesn't yet exist as its own repository.
 * When it is ready, it will be spun off into its own repository on GitHub.
 */
var TouchPassr;
(function (TouchPassr_1) {
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
            // For each provided object, add those settings to the element
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
        /**
         *
         */
        Control.prototype.getOffsets = function (element) {
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
        return Control;
    })();
    TouchPassr_1.Control = Control;
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
    TouchPassr_1.ButtonControl = ButtonControl;
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
            this.proliferateElement(this.elementInner, {
                "style": {
                    "border-radius": "100%"
                }
            });
            // The visible circle is what is actually visible to the user
            this.elementCircle = this.createElement("div", {
                "className": "control-inner control-joystick-circle",
                "style": {
                    "position": "absolute",
                    "background": "red",
                    "borderRadius": "100%"
                }
            });
            this.proliferateElement(this.elementCircle, styles.Joystick.circle);
            // Each direction creates a "tick" element, like on a clock
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
                this.elementCircle.appendChild(element);
            }
            // In addition to the ticks, a drag element shows current direction
            this.elementDragLine = this.createElement("div", {
                "className": "control-joystick-drag-line",
                "style": {
                    "position": "absolute",
                    "opacity": "0",
                    "top": ".77cm",
                    "left": ".77cm"
                }
            });
            this.proliferateElement(this.elementDragLine, styles.Joystick.dragLine);
            this.elementCircle.appendChild(this.elementDragLine);
            // A shadow-like circle supports the drag effect
            this.elementDragShadow = this.createElement("div", {
                "className": "control-joystick-drag-shadow",
                "style": {
                    "position": "absolute",
                    "opacity": "1",
                    "top": "14%",
                    "right": "14%",
                    "bottom": "14%",
                    "left": "14%",
                    "marginLeft": "0",
                    "marginTop": "0",
                    "borderRadius": "100%"
                }
            });
            this.proliferateElement(this.elementDragShadow, styles.Joystick.dragShadow);
            this.elementCircle.appendChild(this.elementDragShadow);
            this.elementInner.appendChild(this.elementCircle);
            this.elementInner.addEventListener("click", this.triggerDragger.bind(this));
            this.elementInner.addEventListener("touchmove", this.triggerDragger.bind(this));
            this.elementInner.addEventListener("mousemove", this.triggerDragger.bind(this));
            this.elementInner.addEventListener("mouseover", this.positionDraggerEnable.bind(this));
            this.elementInner.addEventListener("touchstart", this.positionDraggerEnable.bind(this));
            this.elementInner.addEventListener("mouseout", this.positionDraggerDisable.bind(this));
            this.elementInner.addEventListener("touchend", this.positionDraggerDisable.bind(this));
        };
        /**
         *
         */
        JoystickControl.prototype.positionDraggerEnable = function () {
            this.dragEnabled = true;
            this.elementDragLine.style.opacity = "1";
        };
        /**
         *
         */
        JoystickControl.prototype.positionDraggerDisable = function () {
            this.dragEnabled = false;
            this.elementDragLine.style.opacity = "0";
            this.elementDragShadow.style.top = "14%";
            this.elementDragShadow.style.right = "14%";
            this.elementDragShadow.style.bottom = "14%";
            this.elementDragShadow.style.left = "14%";
        };
        /**
         *
         */
        JoystickControl.prototype.triggerDragger = function (event) {
            event.preventDefault();
            if (!this.dragEnabled) {
                return;
            }
            var coordinates = this.getEventCoordinates(event), x = coordinates[0], y = coordinates[1], offsets = this.getOffsets(this.elementInner), midX = offsets[0] + this.elementInner.offsetWidth / 2, midY = offsets[1] + this.elementInner.offsetHeight / 2, dxRaw = (x - midX) | 0, dyRaw = (midY - y) | 0, dTotal = Math.sqrt(dxRaw * dxRaw + dyRaw * dyRaw), thetaRaw = this.getThetaRaw(dxRaw, dyRaw), directionNumber = this.findClosestDirection(thetaRaw), direction = this.schema.directions[directionNumber], theta = direction.degrees, components = this.getThetaComponents(theta), dx = components[0], dy = -components[1];
            this.proliferateElement(this.elementDragLine, {
                "style": {
                    "marginLeft": ((dx * 77) | 0) + "%",
                    "marginTop": ((dy * 77) | 0) + "%"
                }
            });
            this.proliferateElement(this.elementDragShadow, {
                "style": {
                    "top": ((14 + dy * 10) | 0) + "%",
                    "right": ((14 - dx * 10) | 0) + "%",
                    "bottom": ((14 - dy * 10) | 0) + "%",
                    "left": ((14 + dx * 10) | 0) + "%",
                }
            });
            this.setRotation(this.elementDragLine, (theta + 450) % 360);
            this.positionDraggerEnable();
        };
        /**
         *
         */
        JoystickControl.prototype.getEventCoordinates = function (event) {
            if (event.type === "touchmove") {
                var touch = event.touches[0];
                return [touch.pageX, touch.pageY];
            }
            return [event.x, event.y];
        };
        /**
         *
         */
        JoystickControl.prototype.getThetaRaw = function (dxRaw, dyRaw) {
            // Based on the quadrant, theta changes...
            if (dxRaw > 0) {
                if (dyRaw > 0) {
                    // Quadrant I
                    return Math.atan(dxRaw / dyRaw) * 180 / Math.PI;
                }
                else {
                    // Quadrant II
                    return -Math.atan(dyRaw / dxRaw) * 180 / Math.PI + 90;
                }
            }
            else {
                if (dyRaw < 0) {
                    // Quadrant III
                    return Math.atan(dxRaw / dyRaw) * 180 / Math.PI + 180;
                }
                else {
                    // Quadrant IV
                    return -Math.atan(dyRaw / dxRaw) * 180 / Math.PI + 270;
                }
            }
        };
        /**
         *
         */
        JoystickControl.prototype.getThetaComponents = function (thetaRaw) {
            var theta = thetaRaw * Math.PI / 180;
            return [Math.sin(theta), Math.cos(theta)];
        };
        /**
         *
         */
        JoystickControl.prototype.findClosestDirection = function (degrees) {
            var directions = this.schema.directions, difference = Math.abs(directions[0].degrees - degrees), smallestDegrees = directions[0].degrees, smallestDegreesRecord = 0, record = 0, differenceTest, i;
            // Find the direction with the smallest difference in degrees
            for (i = 1; i < directions.length; i += 1) {
                differenceTest = Math.abs(directions[i].degrees - degrees);
                if (differenceTest < difference) {
                    difference = differenceTest;
                    record = i;
                }
                if (directions[i].degrees < smallestDegrees) {
                    smallestDegrees = directions[i].degrees;
                    smallestDegreesRecord = i;
                }
            }
            // 359 is closer to 360 than 0, so pretend the smallest is above 360
            differenceTest = Math.abs(smallestDegrees + 360 - degrees);
            if (differenceTest < difference) {
                difference = differenceTest;
                record = smallestDegreesRecord;
            }
            return record;
        };
        return JoystickControl;
    })(Control);
    TouchPassr_1.JoystickControl = JoystickControl;
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
            // @todo keep a mapping of control classes, not this switch statement
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
    TouchPassr_1.TouchPassr = TouchPassr;
})(TouchPassr || (TouchPassr = {}));
