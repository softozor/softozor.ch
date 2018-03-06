const path = require('path');
const webpack = require('webpack');
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
const bitters = require('bourbon-bitters').includePaths;
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = (process.env.NODE_ENV || 'development').trim();

const isProd = env === 'production';

var plugins = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  }),
  new ExtractTextPlugin({
    filename: '[name].[chunkhash].css',
    allChunks: true
  }),
  // https://stackoverflow.com/questions/30329337/how-to-bundle-vendor-scripts-separately-and-require-them-as-needed-with-webpack/38733864#38733864
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: '[name].[chunkhash].js',
    minChunks: function(module) {
      return isExternal(module);
    }
  }),
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
  new CopyWebpackPlugin([
    {
      from: 'assets/footer',
      to: 'assets/footer'
    },
    {
      from: 'assets/team',
      to: 'assets/team'
    },
    {
      from: 'assets/focus',
      to: 'assets/focus'
    },
    {
      from: 'assets/news.png',
      to: 'assets/news.png'
    },
    {
      from: 'server',
      to: 'server'
    },
    {
      from: 'config',
      to: 'config'
    },
    {
      from: 'images/icon/icon1.ico',
      to: 'favicon.ico'
    }
  ])
];

if (isProd) {
  plugins.push(new UglifyJSPlugin());
}

module.exports = {
  entry: {
    bundle: ['./src/index.ts', './sass/app.scss']
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: ['file-loader']
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(js|pug)$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: isProd
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () =>
                autoprefixer({
                  browsers: ['last 3 versions', '> 1%']
                })
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [bourbon, neat, bitters]
            }
          }
        ])
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader'
        }
      }
    ]
  },
  plugins: getPlugins()
};

function getPlugins() {
  return plugins;
}

function isExternal(module) {
  const context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') >= 0;
}
