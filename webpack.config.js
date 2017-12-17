const path = require('path');
const webpack = require('webpack');
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
const bitters = require('bourbon-bitters').includePaths;
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const VENDOR_LIBS = ['lodash', 'jquery']

module.exports = {
  entry: {
    bundle: [
      './src/index.ts',
      './sass/app.scss'
    ],
    vendor: VENDOR_LIBS
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,   
        use: ['file-loader']
      }, {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
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
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(['css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => autoprefixer({
              browsers: ['last 3 versions', '> 1%']
            })
          }
        }, {
            loader: 'sass-loader',
            options: {
              includePaths: [bourbon, neat, bitters]
            }
          }])
      }, {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      }
    ]
  }, 
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'lodash',
    }), new ExtractTextPlugin({
      filename: '[name].[chunkhash].css',
      allChunks: true,
    }), new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }), new HtmlWebpackPlugin({
      template: 'src/index.html'
    }), new CopyWebpackPlugin([{
      from: 'assets/footer',
      to: 'assets/footer'
      }, {
        from: 'assets/team',
        to: 'assets/team'
    }, {
      from: 'scripts',
      to: 'scripts'
    }])]
};