const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const precss = require('precss')

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
        loader: 'riotjs-loader'
      }
    ],
    loaders: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?presets=es2015'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
    ],
  },
  externals: [
    /^[a-z\-0-9]+$/
  ],
  postcss: () => [autoprefixer, precss]
}

