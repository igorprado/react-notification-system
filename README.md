# React Notification System

Parameters:

* Message (required)
* Level (required)
* Position (default: top right)
* Delay (default: 5 secs)
* Auto-dismiss (default: true)
* Dismissible (default: true)
* Action (default: null)

## Levels

There are four levels available:

* Success
* Error
* Warning
* Info


## Positions

There are six positions available:

* TL - Top left
* TR - Top right
* TC - Top center
* BL - Bottom left
* BR - Bottom right
* BC - Bottom center

## Delay

Time before the notification be dismissed.

## Auto-dismiss

By default, every notification will be dismissed after 5 secs. Setting this to false, the notification will not dismiss automatically.

## Dismissible

By default, every notification is dismissible by clicking on X button. Setting this to false, the notification will be only dismissible after action callback (see below) is fired.

## Action

Sometimes you want your notification to perform more than simple show a message. You can pass an action obj, with a label and a callback function. This will reproduce a button on notification. See our example page.
