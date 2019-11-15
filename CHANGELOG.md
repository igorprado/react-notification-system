# CHANGELOG

## 0.3.0 - Nov 14, 2019

* Updated to class components and removed future deprecated lifecycle methods (thanks to @oskarer)

## 0.2.17 - Feb 21, 2018

* Dismissible enhancements (thanks to @thepeted)

## 0.2.16 - Oct 19, 2017

* Support for React 16 (thanks to @marudor)

## 0.2.15 - Aug 1, 2017

* UMD build now specifies the library name (thanks to @franckamayou)

## 0.2.14 - May 3, 2017

* Ability to [edit notifications](https://github.com/igorprado/react-notification-system#removenotificationnotification). (thanks to @syndbg)
* Removed deprecation warning. Now using `prop-types` and `create-react-class`packages. (thanks to @andrewBalekha)
* Fix calling `onRemove` before updating the notifications state. (thanks to @szdc)

## 0.2.13 - Mar 14, 2017

* UMD support. (thanks to @jochenberger)

## 0.2.12 - Mar 01, 2017

* Adds support for enter and exit animations for NotificationItem. (thanks to @OriR)

## 0.2.11 - Dec 06, 2016

* Added `clearNotifications()` method (thanks to @saaqibz)

## 0.2.10 - Aug 29, 2016

* Allows children content to override `action`. (thanks to @gor181)

## 0.2.9 - Aug 25, 2016

* Improved CSS styles for better performance
* Merged pull request to avoid warnings related to component state

## 0.2.7 - Nov 20, 2015

**React 15 support:**

* Version 0.2.x now supports React 15 too.


## 0.2.6 - Nov 20, 2015

**Bugfix from PR:**

* Fix wrapper styles override.


## 0.2.5 - Oct 15, 2015

**Implemented enhancements:**

* Action property no longer needs a callback, just a label.

## 0.2.4 - Oct 12, 2015

**Implemented enhancements:**

* Added React and ReactDOM as peerDependencies and devDependencies to help on component development.

## 0.2.3 - Oct 11, 2015

**Implemented enhancements:**

* Possibility to remove notification by uid.
* Added onAdd property to notification object.
* Improved styles.

## 0.2.2 - Oct 10, 2015

** Removed unused code**

* Some unnecessary `console.logs` was left behind.

## 0.2.1 - Oct 9, 2015

**Implemented enhancements:**

* Improved function to get specific style based on element.
* Improved notification styles.
* Added ESLint and linted all src files.

## 0.2.0 - Oct 9, 2015

**Implemented enhancements:**

* Now supports React 0.14!

## 0.1.17 - Oct 9, 2015

**Implemented enhancements, merged pull requrests:**

* Fix dismissible false to not require an action.
* Added CHANGELOG and LICENSE files.

## 0.1.15 - Oct 1, 2015

**Implemented enhancements:**

* `addNotification()` method now returns the notification object.
* Added method `removeNotification()` to remove a notification programmatically based on returned notification object.
