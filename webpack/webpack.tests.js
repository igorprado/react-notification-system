const testsContext = require.context('../test', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);

const componentsContext = require.context('../src', true, /.jsx?$/);
componentsContext.keys().forEach(componentsContext);
