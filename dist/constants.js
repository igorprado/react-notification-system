var CONSTANTS = {

  // Positions
  positions: {
    tl: 'tl',
    tr: 'tr',
    tc: 'tc',
    bl: 'bl',
    br: 'br',
    bc: 'bc'
  },

  // Position array
  positionsArray: ['tl', 'tr', 'tc', 'bl', 'br', 'bc'],

  // Levels
  levels: {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  },

  // Levels array
  levelsArray: ['success', 'error', 'warning', 'info'],

  // Notification defaults
  notification: {
    message: null,
    level: null,
    position: 'tr',
    autoDismiss: 5,
    dismissible: true,
    action: null
  },

  // Animation defaults
  animations: {
    notificationItem: {
      show: 400,
      hide: 100
    }
  }
};


module.exports = CONSTANTS;
