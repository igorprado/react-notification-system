/* eslint-disable */

var webpack = require('webpack');

var coverage;
var reporters;
var browsers;
if (process.env.CONTINUOUS_INTEGRATION) {
  coverage = {
    type: 'lcov',
    dir: 'coverage/'
  };
  reporters = ['coverage', 'coveralls'];
  browsers = ['Chrome_travis_ci'];
}
else {
  coverage = {
    type: 'html',
    dir: 'coverage/'
  };
  reporters = ['progress', 'coverage'];
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
