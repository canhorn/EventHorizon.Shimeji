var Behaviors = Behaviors ? Behaviors : {};

Behaviors.randomSelector = (shimeji, behaviorProps, onExitCallback) => {
    var randomActionFunction = function() {
        // Pick random element
        var transition = Math.random();
        var _r = 0;
        for (var i = 0; i < behaviorProps['_states'].length; i++) {
            var state = behaviorProps['_states'][i];
            if (
                _r <= transition &&
                _r + behaviorProps[state].prob >= transition
            ) {
                // Enter state
                console.log(
                    'Enter ' + state + ' N:' + behaviorProps[state].name
                );
                if (!behaviorProps[state].isExit) {
                    shimeji.act(
                        behaviorProps[state].name,
                        behaviorProps[state].repeat
                            ? behaviorProps[state].repeat
                            : 1,
                        behaviorProps[state].revH,
                        behaviorProps[state].revV,
                        behaviorProps[state].revM,
                        randomActionFunction
                    );
                    return;
                } else {
                    if (typeof onExitCallback === 'function') {
                        onExitCallback();
                    }
                    return;
                }
            }
            _r += behaviorProps[state].prob;
        }
        if (typeof onExitCallback === 'function') {
            onExitCallback();
        }
        return;
    };
    randomActionFunction();
};
