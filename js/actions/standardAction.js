var Actions = Actions ? Actions : {};

/**
 * Actions Used:
 * - sleep
 * - climb
 * - fall
 * - walk
 * - land
 * - stand
 */
Actions.standard = avatar => (what, environment) => {
    console.log(['START: ', what, environment, 'Yo!']);
    if (what == 'exit_left') {
        avatar.place(environment.left + 1, avatar._y);
        avatar.cancelAct();

        Behaviors.randomSelector(avatar, {
            _states: ['climb_up', 'climb_down'],
            climb_up: { name: 'climb', repeat: 1, prob: 0.8 }, // prob => probability
            climb_down: { name: 'climb', repeat: 1, revM: 1, prob: 0.2 },
        });
    } else if (what === 'exit_right') {
        avatar.place(environment.right - 1, avatar._y);
        avatar.cancelAct();

        Behaviors.randomSelector(avatar, {
            _states: ['climb_up', 'climb_down'],
            climb_up: { name: 'climb', repeat: 1, revH: true, prob: 0.8 }, // prob => probability
            climb_down: {
                name: 'climb',
                repeat: 1,
                revM: true,
                revM: true,
                prob: 0.2,
            },
        });
    } else if (what === 'exit_top') {
        // Figure out what edge is closer
        if (
            Math.abs(avatar._x - environment.left) <
            Math.abs(avatar._x - environment.right)
        ) {
            console.log('exit_top_left');
            // From Left Edge
            avatar.place(avatar._x, environment.top + 1);
            avatar.cancelAct();
            avatar.act('walk', 2, true, false, false, function() {
                avatar.place(avatar._x, avatar._y);
                if (avatar.config.behavior['exit_top_left']) {
                    Behaviors.randomSelector(
                        avatar,
                        avatar.config.behavior['exit_top_left']
                    );
                } else {
                    // Default
                    avatar.act('action1', 1, true);
                    avatar.act('fall', 40);
                }
            });
        } else {
            console.log('exit_top_right');
            // From Right Edge
            avatar.place(avatar._x, environment.top + 1);
            avatar.cancelAct();
            avatar.act('walk', 2, false, false, false, function() {
                avatar.place(avatar._x, avatar._y);
                if (avatar.config.behavior['exit_top_right']) {
                    Behaviors.randomSelector(
                        avatar,
                        avatar.config.behavior['exit_top_right']
                    );
                } else {
                    avatar.act('action1', 1);
                    avatar.act('fall', 40);
                }
            });
        }
    } else if (what === 'exit_bottom') {
        // Figure out what edge is closer
        if (
            Math.abs(avatar._x - environment.left) <
            Math.abs(avatar._x - environment.right)
        ) {
            console.log('exit_bottom_left');
            // From Left Edge
            avatar.place(avatar._x, environment.bottom - 1);
            avatar.cancelAct();
            avatar.act('land', 1, false, false, false);
            avatar.act('stand', 1, false, false, false, function() {
                if (avatar.config.behavior['exit_bottom_left']) {
                    Behaviors.randomSelector(
                        avatar,
                        avatar.config.behavior['exit_bottom_left']
                    );
                } else {
                    Behaviors.randomSelector(avatar, {
                        _states: ['stand', 'walk_l', 'walk_r', 'sleep'],
                        stand: { name: 'stand', repeat: 1, prob: 0.4 },
                        sleep: { name: 'sleep', repeat: 1, revH: 1, prob: 0.1 },
                        walk_l: { name: 'walk', repeat: 1, prob: 0.25 },
                        walk_r: {
                            name: 'walk',
                            repeat: 1,
                            revH: 1,
                            prob: 0.25,
                        },
                    });
                }
            });
        } else {
            console.log('exit_bottom_right');
            // From Right Edge
            avatar.place(avatar._x, environment.bottom - 1);
            avatar.cancelAct();
            avatar.act('land', 1, false, false, false);
            avatar.act('stand', 1, false, false, false, function() {
                if (avatar.config.behavior['exit_bottom_right']) {
                    Behaviors.randomSelector(
                        avatar,
                        avatar.config.behavior['exit_bottom_right']
                    );
                } else {
                    Behaviors.randomSelector(avatar, {
                        _states: ['stand', 'walk_l', 'walk_r', 'sleep'],
                        stand: { name: 'stand', repeat: 1, prob: 0.4 },
                        sleep: { name: 'sleep', repeat: 1, prob: 0.1 },
                        walk_l: { name: 'walk', repeat: 1, prob: 0.25 },
                        walk_r: {
                            name: 'walk',
                            repeat: 1,
                            revH: 1,
                            prob: 0.25,
                        },
                    });
                }
            });
        }
    }
    console.log(['END: ', what, environment, 'Yo!']);
};
