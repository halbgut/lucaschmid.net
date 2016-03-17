const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const level4 = require('level4')

module.exports = {
  entry: './client/entry.js',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/client/build/`
  },
  plugins: [
    new webpack.ProvidePlugin({ riot: 'riot' })
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
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
    ],
  },
  postcss: () => [level4, autoprefixer, cssnano]
}

