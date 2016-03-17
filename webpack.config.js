const webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './client/entry.js',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/client/build/`
  },
  plugins: [
    new webpack.ProvidePlugin({ riot: 'riot' }),
    new ExtractTextPlugin('[name].css')
  ],
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
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize')
      }
    ]
  }
}

