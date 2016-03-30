const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const dev = process.env.NODE_ENV !== 'production'
const plugins = [
  new webpack.ProvidePlugin({ riot: 'riot' }),
  new ExtractTextPlugin('[name].css')
]

if (!dev) plugins.push(new webpack.optimize.UglifyJsPlugin())
if (!dev) plugins.push(new webpack.optimize.DedupePlugin())

module.exports = {
  entry: {
    main: './client/entry',
    application: './client/application'
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/client/build/`
  },
  plugins,
  module: {
    preLoaders: [
      {
        test: /\.tag$/,
        loader: 'riotjs-loader?type=none'
      }
    ],
    loaders: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json'
      },
      {
        test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets=es2015'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          (dev
            ? 'css-loader?-minimize!postcss-loader'
            : 'css-loader?minimize!postcss-loader'
          )
        )
      }
    ]
  },
  postcss: () => [autoprefixer]
}

