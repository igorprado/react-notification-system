/* eslint-disable */
var webpack = require('webpack');
var path = require('path');

var coverage;
var reporters;
var browsers;
if (process.env.CONTINUOUS_INTEGRATION) {
  coverage = {
    type: 'lcov',
    dir: 'coverage/'
  };
  reporters = ['coverage-istanbul', 'coveralls'];
  browsers = ['Chrome_travis_ci'];
}
else {
  coverage = {
    type: 'html',
    dir: 'coverage/'
  };
  reporters = ['progress', 'coverage-istanbul'];
  browsers = ['Chrome'];
}

module.exports = function (config) {
  config.set({
    browsers: browsers,
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },
    browserNoActivityTimeout: 30000,
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    files: ['webpack/webpack.tests.js'],
    preprocessors: {'webpack/webpack.tests.js': ['webpack', 'sourcemap']},
    reporters: reporters,
    coverageIstanbulReporter: {
      reports: [ 'text-summary' ],
      fixWebpackSourcePaths: true
    },
    plugins: [
      'karma-webpack',
      'karma-coverage',
      'karma-coverage-istanbul-reporter',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-chai-plugins',
      'karma-coveralls'
    ],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$|.jsx$/,
            loader: 'babel-loader?presets=airbnb',
            exclude: /node_modules/
          },
          {
            test: /\.js$|.jsx$/,
            include: path.resolve(__dirname, '../src/'),
            loader: 'istanbul-instrumenter-loader'
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
