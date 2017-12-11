const path = require('path');
const webpack = require('webpack');
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
const bitters = require('bourbon-bitters').includePaths;
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_PATH = './dist/';

module.exports = {
  entry: ['./src/index.js', './sass/app.scss'],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: BUILD_PATH
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,   
        use: [{
          loader: 'url-loader',
          options: { limit: 40000 }
        }, 'image-webpack-loader']
      }, {
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
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return autoprefixer;
              }
            }
          }]
        })
      }]
  }, 
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'lodash',
    }), new ExtractTextPlugin({
      filename: 'app.css',
      allChunks: true,
    })]
};
