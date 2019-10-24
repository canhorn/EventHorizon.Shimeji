var Shimeji = (function(systemWindow) {
    class Shimeji {
        config = null;
        actionQueue = [];
        environment = [];
        behaviors = {};
        container = null;
        image = null;
        _timeout = -1;
        _x = null;
        _y = null;

        constructor(config) {
            this.config = config;
        }

        init(element, x, y) {
            if (!element) {
                throw 'Invalid binding element';
            }
            var image = document.createElement('img');
            element.appendChild(image);
            this.container = element;
            this.image = image;
            this._x = typeof x === 'number' ? x : this.container.offsetLeft;
            this._y = typeof y === 'number' ? y : this.container.offsetTop;

            this.place(this._x, this._y);
        }

        makeEnvironment(elementArray) {
            this.environment.push({
                name: 'page',
                top: 0,
                left: 0,
                bottom: systemWindow.innerHeight,
                right: systemWindow.innerWidth,
            });
            if (typeof elementArray === 'undefined') {
                return;
            }
            for (let index = 0; index < elementArray.length; index++) {
                const element = elementArray[index];
                this.environment.push({
                    name: element.id !== '' ? element.id : 'elem_' + index,
                    top: element.offsetTop,
                    bottom: element.offsetTop + element.offsetHeight,
                    left: element.offsetLeft,
                    right: element.offsetLeft + element.offsetWidth,
                });
            }
        }

        _isEnv(env, x, y) {
            return (
                x < env.right && x > env.left && y > env.top && y < env.bottom
            );
        }

        place(x, y) {
            this._x = x;
            this._y = y;
            this.container.style.left = `${this._x}px`;
            this.container.style.top = `${this._y}px`;
        }

        cancelAct() {
            this.actionQueue = [];
        }

        interact(oX, oY) {
            for (let index = 0; index < this.environment.length; index++) {
                const environment = this.environment[index];
                if (
                    this._isEnv(environment, this._x, this._y) !==
                    this._isEnv(environment, oX, oY)
                ) {
                    var interact = [];
                    if (this._isEnv(environment, oX, oY)) {
                        interact.push('exit');
                        if (
                            this._y >= environment.bottom &&
                            oY < environment.bottom
                        ) {
                            interact.push('bottom');
                        } else if (
                            this._y <= environment.top &&
                            oY > environment.top
                        ) {
                            interact.push('top');
                        }
                        if (
                            this._x >= environment.right &&
                            oX < environment.right
                        ) {
                            interact.push('right');
                        } else if (
                            this._x <= environment.left &&
                            oX > environment.left
                        ) {
                            interact.push('left');
                        }
                    } else {
                        interact.push('enter');
                        if (
                            this._y <= environment.bottom &&
                            oY > environment.bottom
                        ) {
                            interact.push('bottom');
                        } else if (
                            this._y >= environment.top &&
                            oY < environment.top
                        ) {
                            interact.push('top');
                        }
                        if (
                            this._x <= environment.right &&
                            oX > environment.right
                        ) {
                            interact.push('right');
                        } else if (
                            this._x >= environment.left &&
                            oX < environment.left
                        ) {
                            interact.push('left');
                        }
                    }
                    var interactionKey = interact.join('_');
                    if (typeof this.behaviors[environment.name] == 'function') {
                        this.behaviors[environment.name](
                            interactionKey,
                            environment
                        );
                    } else if (
                        this.behaviors[environment.name] &&
                        this.behaviors[environment.name][interactionKey]
                    ) {
                        if (
                            typeof (
                                this.behaviors[environment.name][
                                    interactionKey
                                ] !== 'function'
                            )
                        ) {
                            this.actionQueue = [];
                            this.act(
                                this.behaviors[environment.name][interactionKey]
                            );
                            return;
                        } else {
                            this.behaviors[environment.name][interactionKey](
                                environment
                            );
                        }
                    }
                }
            }
        }
        pose(posture) {
            this.image.src =
                (this.config.baseUrl ? this.config.baseUrl : '') + posture.src;
            this.image.style.left = -posture.anchor[0] + 'px';
            this.image.style.top = -posture.anchor[1] + 'px';

            this.image.className =
                (posture.reverseVert ? 'reverse-vertical' : '') +
                ' ' +
                (posture.reverseHori ? 'reverse-horizontal' : '');
            var oX = this._x,
                oY = this._y;
            this._x += (posture.reverseHori ? -1 : 1) * posture.move.x;
            this._y += (posture.reverseVert ? -1 : 1) * posture.move.y;
            this.interact(oX, oY);

            this.container.style.transition =
                'top ' +
                posture.duration +
                'ms, left ' +
                posture.duration +
                'ms linear';
            this.place(this._x, this._y);
        }
        act(action, repeat, reverseH, reverseV, reverseM, onEnd) {
            if (typeof repeat !== 'number') {
                repeat = -1;
            }
            if (this.config.actions[action]) {
                if (reverseM) {
                    for (let r = 0; r < repeat.length; r++) {
                        for (
                            let index = 0;
                            index < this.config.actions[action].length;
                            index++
                        ) {
                            const action = this.config.actions[action][index];
                            this.actionQueue.push(action);
                        }
                    }
                } else {
                    for (let r = 0; r < repeat; r++) {
                        for (
                            let index = 0;
                            index < this.config.actions[action].length;
                            index++
                        ) {
                            const selectedAction = this.config.actions[action][
                                index
                            ];
                            var reverseAction = {};
                            for (const prop in selectedAction) {
                                if (selectedAction.hasOwnProperty(prop)) {
                                    const actionProp = selectedAction[prop];
                                    reverseAction[prop] = actionProp;
                                }
                            }
                            reverseAction['reverseVert'] = reverseV;
                            reverseAction['reverseHori'] = reverseH;
                            this.actionQueue.push(reverseAction);
                        }
                    }
                }
                if (typeof onEnd === 'function') {
                    this.actionQueue.push(onEnd);
                }
                if (this._timeout < 0) {
                    var __this = this;
                    var _callback = function() {
                        if (__this.actionQueue.length > 0) {
                            var posture = __this.actionQueue.shift();
                            if (typeof posture === 'function') {
                                posture();
                                _callback();
                                return;
                            }
                            __this.pose(posture);
                            __this._timeout = setTimeout(
                                _callback,
                                posture.duration
                            );
                        } else {
                            __this._timeout = -1;
                        }
                    };
                    _callback();
                }
            }
        }
        behavior(trigger, action, hook) {
            if (typeof hook === 'undefined') {
                this.behaviors[trigger] = action;
            } else {
                if (!this.behaviors[trigger]) {
                    this.behaviors[trigger] = {};
                }
                this.behaviors[trigger][hook] = action;
            }
        }
    }
    return Shimeji;
})(window);
