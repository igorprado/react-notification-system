/* eslint-disable */

var webpack = require('webpack');

var coverage;
var reporters;
if (process.env.CONTINUOUS_INTEGRATION) {
  coverage = {
    type: 'lcov',
    dir: 'coverage/'
  };
  reporters = ['coverage', 'coveralls'];
}
else {
  coverage = {
    type: 'html',
    dir: 'coverage/'
  };
  reporters = ['progress', 'coverage'];
}

module.exports = function (config) {
  config.set({
    browsers: ['Firefox'],
    browserNoActivityTimeout: 30000,
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    files: ['tests.webpack.js'],
    preprocessors: {'tests.webpack.js': ['webpack', 'sourcemap']},
    reporters: reporters,
    coverageReporter: coverage,
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          // TODO: fix sourcemaps
          // see: https://github.com/deepsweet/isparta-loader/issues/1
          {
            test: /\.js$|.jsx$/,
            loader: 'babel?presets=airbnb',
            exclude: /node_modules/
          },
          {
            test: /\.js$|.jsx$/,
            loader: 'isparta?{babel: {stage: 0}}',
            exclude: /node_modules|test|utils/
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('test')
          }
        })
      ],
      resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules', 'src']
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};
