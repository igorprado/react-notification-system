// Browser ES6 Polyfill
// require('babel/polyfill');
const context = require.context('./test', true, /\.test\.jsx$|\.test\.js$/);
context.keys().forEach(context);
