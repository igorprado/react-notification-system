// Used for calculations
var defaultWidth = 320;
var defaultColors = {
  success: '#5ea400',
  error: '#ec3d3d',
  warning: '#ebad1a',
  info: '#369cc7'
}

var STYLES = {

  Wrapper: {},
  Containers: {
    DefaultStyle: {
      fontFamily: 'inherit',
      position: 'fixed',
      width: defaultWidth,
      padding: '0 10px 10px 10px',
      zIndex: 9998,
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      boxSizing: 'border-box',
      height: 'auto'
    },

    tl: {
      top: "0px",
      bottom: "auto",
      left: '0px',
      right: 'auto'
    },

    tr: {
      top: "0px",
      bottom: "auto",
      left: 'auto',
      right: '0px'
    },

    tc: {
      top: "0px",
      bottom: "auto",
      margin: "0 auto",
      left: "50%",
      marginLeft: -(defaultWidth/2)
    },

    bl: {
      top: "auto",
      bottom: "0px",
      left: '0px',
      right: 'auto'
    },

    br: {
      top: "auto",
      bottom: "0px",
      left: 'auto',
      right: '0px'
    },

    bc: {
      top: "auto",
      bottom: "0px",
      margin: "0 auto",
      left: "50%",
      marginLeft: -(defaultWidth/2)
    }

  },

  NotificationItem: {
    DefaultStyle: {
      position: 'relative',
      width: '100%',
      cursor: 'pointer',
      borderRadius: '2px',
      fontSize: '13px',
      border: '1px solid',
      borderTopWidth: '4px',
      margin: '10px 0 0',
      padding: '10px',
      display: 'block',
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      boxSizing: 'border-box',
      WebkitBoxShadow: '0px 0px 5px 2px rgba(0,0,0,0.1)',
      MozBoxShadow: '0px 0px 5px 2px rgba(0,0,0,0.1)',
      boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.1)',
      opacity: 0,
      transition: '0.3s ease-in-out'
    },

    success: {
      borderColor: '#d0ddbe',
      borderTopColor: defaultColors.success,
      backgroundColor: '#f0f5ea',
      color: '#4b583a'
    },

    error: {
      borderColor: '#edbfbf',
      borderTopColor: defaultColors.error,
      backgroundColor: '#f4e9e9',
      color: '#412f2f'
    },

    warning: {
      borderColor: '#ecd9ab',
      borderTopColor: defaultColors.warning,
      backgroundColor: '#f9f6f0',
      color: '#5a5343'
    },

    info: {
      borderColor: '#b2d0dd',
      borderTopColor: defaultColors.info,
      backgroundColor: '#e8f0f4',
      color: '#41555d'
    }
  },

  Title: {
    DefaultStyle: {
      fontSize: '14px',
      margin: '0 0 5px 0',
      padding: 0,
      fontWeight: 'bold'
    },

    success: {
      color: defaultColors.success
    },

    error: {
      color: defaultColors.error
    },

    warning: {
      color: defaultColors.warning
    },

    info: {
      color: defaultColors.info
    }

  },

  MessageWrapper: {
    DefaultStyle: {
      margin: 0,
      padding: 0
    }
  },

  Dismiss: {
    DefaultStyle: {
      fontFamily: 'Arial',
      fontSize: '17px',
      position: 'absolute',
      top: '4px',
      right: '5px',
      lineHeight: '15px',
      backgroundColor: '#dededf',
      color: '#ffffff',
      borderRadius: '50%',
      width: '14px',
      height: '14px',
      fontWeight: 'bold',
      textAlign: 'center'
    },

    success: {
      color: '#f0f5ea',
      backgroundColor: '#b0ca92'
    },

    error: {
      color: '#f4e9e9',
      backgroundColor: '#e4bebe'
    },

    warning: {
      color: '#f9f6f0',
      backgroundColor: '#e1cfac'
    },

    info: {
      color: '#e8f0f4',
      backgroundColor: '#a4becb'
    }
  },

  Action: {
    DefaultStyle: {
      background: '#ffffff',
      borderRadius: '2px',
      padding: '6px 20px',
      fontWeight: 'bold',
      margin: '10px 0 0 0',
      border: 0
    },

    success: {
      backgroundColor: defaultColors.success,
      color: '#ffffff'
    },

    error: {
      backgroundColor: defaultColors.error,
      color: '#ffffff'
    },

    warning: {
      backgroundColor: defaultColors.warning,
      color: '#ffffff'
    },

    info: {
      backgroundColor: defaultColors.info,
      color: '#ffffff'
    }
  },

  ActionWrapper: {
    DefaultStyle: {
      margin: 0,
      padding: 0
    }
  }
};

module.exports = STYLES;
