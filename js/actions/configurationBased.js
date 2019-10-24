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
Actions.configuration = avatar => (what, environment) => {
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
            avatar.place(avatar._x, environment.top + 1);
            avatar.cancelAct();
            avatar.act('walk', 2, true, false, false, function() {
                avatar.place(avatar._x, avatar._y);
                avatar.act('action1', 1, true);
                avatar.act('fall', 40);
            });
        } else {
            avatar.place(avatar._x, environment.top + 1);
            avatar.cancelAct();
            avatar.act('walk', 2, false, false, false, function() {
                avatar.place(avatar._x, avatar._y);
                avatar.act('action1', 1);
                avatar.act('fall', 40);
            });
        }
    } else if (what === 'exit_bottom') {
        // Figure out what edge is closer
        if (
            Math.abs(avatar._x - environment.left) <
            Math.abs(avatar._x - environment.right)
        ) {
            avatar.place(avatar._x, environment.bottom - 1);
            avatar.cancelAct();
            avatar.act('land', 1, false, false, false);
            avatar.act('stand', 1, false, false, false, function() {
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
            });
        } else {
            avatar.place(avatar._x, environment.bottom - 1);
            avatar.cancelAct();
            avatar.act('land', 1, false, false, false);
            avatar.act('stand', 1, false, false, false, function() {
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
            });
        }
    }
    console.log(['END: ', what, environment, 'Yo!']);
    // avatar.behavior('zbox', run(avatar));
    // avatar.act('fall', 40);
};
