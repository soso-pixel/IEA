//-------------------------------------------------------------------------------
// This is the dev config file. It takes the common config file and merge it
// with its own rules.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = env => merge(common, {
  mode: 'development',
  entry:  path.resolve(__dirname, `../../src/js/main.js`),
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[hash].js',
    globalObject: 'this'
  },
  devServer: {
    https: false,
  },
  module: {
    rules: [
      {
        test: /\.(jpeg|jpg|gif|png|woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 12800,
          name: (name) => {
            let ext = name.split('.');
            ext = ext[ext.length - 1]
            switch (ext) {
              case 'jpeg':
              case 'jpg':
              case 'png':
              case 'gif':
                ext = 'images';
                break;
              case 'woff':
              case 'woff2':
              case 'eot':
              case 'ttf':
                ext = 'fonts';
                break;
              default:
                ext = 'miscellaneous'
            }
            return `${ext}/[name].[ext]`;
          },
          outputPath: "assets"
        },
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
         'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }
        ],
      },
      {
        test: /\.(c|sa|sc)ss$/,
        exclude: /node_modules/,
        use: [
          'css-hot-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/'
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }

        ],
        sideEffects: true,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { configFile: path.resolve(__dirname, '../babel.config.js') }
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]
})
