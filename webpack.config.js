const path = require('path');
const webpack = require('webpack');
// when the latest version on npm is recent enough, uncomment these lines 
// also uncomment the includePaths option of the sass-loader down below
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
const bitters = require('bourbon-bitters').includePaths;

const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: ['./src/index.js', './sass/app.scss'],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }, { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract([{
            loader: 'css-loader'
        }, {
            loader: 'sass-loader',
            options: {
              includePaths: [bourbon, neat, bitters]
            }
        }])
      }, { // regular css files
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: {
            loader: 'css-loader',
            options: {
              importLoaders: true
            }
          }
        })
      }
    ]
  }, 
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
  }), new ExtractTextPlugin({
      filename: 'app.css',
      allChunks: true,
    })]
};
