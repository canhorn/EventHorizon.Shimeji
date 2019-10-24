# EventHorizon Shimeji / Avatar

This project is a browser and configuration based library that will animate an Avatar over an implemented webpage.

# Usage

Clone this repository and create a Character configuration, use one of the examples under the characters folder for reference.

# Character Configuration

Characters configuration is used to animate a chosen Avatar's Actions, and those actions can be used to trigger a different behavior based on where the avatar is on the screen.

The name, license, and baseUrl are standard properties of a character/mascot's configuration. The base URL is the location of the frames used to animate the avatars actions.

In the actions section of the characters configuration are a map of different animations that can be triggered. The actions trigger can be used during the processing of a behavior.

## Action Data Model:

- src -> The file name used for the Actions animation.
- anchor -> This is the location on the frame the point should be "centered" or drawn from.
- move -> The x and y direction this frame should move. Use 0 for both if it should not move.
- duration -> The length of time in milliseconds this frame should be on screen for.

## Behavior Data Model:

- _states -> This is the set of states that should be randomly selected from when ran.
- Include with the _states property should the list of actions details when selected.
  - name -> The name on the state should the Action that should run.
  - repeat -> How many times the action should be run.
  - prob -> The percentage this actions will be selected.
  - revH -> If the run action should animate its frames reversed Horizontally.
  - revV -> If the run action should animate its frames reversed Vertically.
  - revM -> If the run action should animate its frames Movement reversed.

Example:

~~~ json
{
    "_states": [
        "stand",
        "sit",
        "sleep"
    ],
    "stand": {
        "name": "stand",
        "repeat": 1,
        "prob": 0.3
    },
    "sit": {
        "name": "sit",
        "repeat": 1,
        "prob": 0.1
    },
    "sleep": {
        "name": "sleep",
        "repeat": 1,
        "prob": 0.05
    }
}
~~~
