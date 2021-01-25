//-------------------------------------------------------------------------------
// This is the dev config file. It takes the common config file to merge it
// with its own rules.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require("webpack")
const CompressionPlugin = require('compression-webpack-plugin')
const UnCSSPlugin = require('uncss-webpack-plugin');
const className = require('../../src/site/assets/js/utilities/generateClassname.js')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = env => merge(common, {
  mode: 'production',
  entry:  path.resolve(__dirname, `../../src/site/js/main.js`),
  output: {
    path: path.resolve(__dirname, `../../build/site/uncompressed`),
    filename: 'js/[name].[contenthash:8].js',
  },
      module: {
        rules: [
          {
          test: /\.html$/,
          use: [
            {
            loader: 'html-loader',
            options: {
              minimize: true
            }
            }
          ],
        },
          {
            test: /\.(jpeg|jpg|gif|png|woff|woff2|eot|ttf)$/,
            use: [
              {loader: 'url-loader',
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
                  //publicPath: "../assets",
                  outputPath: "assets"
                },
              },
              'image-webpack-loader'
            ]
          },
          {
            test: /\.css$/,
            include: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,

                }
              },
              { loader: 'postcss-loader', options: { config: {path: path.resolve(__dirname,'./config/postcss.config.js')}} },

            ],
            sideEffects: true,
          },
          {
            test: /\.(c|sa|sc)ss$/,
            exclude: /node_modules/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: (resourcePath, context) => {

                    // publicPath is the relative path of the resource to the context
                    // e.g. for ./css/admin/main.css the publicPath will be ../../
                    // while for ./css/main.css the publicPath will be ../
                    return path.relative(path.dirname(resourcePath), context) + '/';
                  }
                }
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  sourceMap: false,
                  modules: {
                    getLocalIdent: (context, localIdentName, localName) => {
                      return className.generateScopedName(localName, context.resourcePath);
                    }
                  }
                }
              },
              { loader: 'postcss-loader', options: { config: {path: path.resolve(__dirname,'./config/postcss.config.js')}} },
              'sass-loader' // compiles Sass to CSS

            ],
            sideEffects: true,
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
              { loader: 'babel-loader', options: { configFile: path.resolve(__dirname,'../babel.config.js')}  },
            ],
          },
        ],
      },
        optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                    terserOptions: {
                        warnings: false,
                        output: {
                            comments: false
                        },
                        compress: {
                          //passes: 2,
                            unused: true,
                            dead_code: true, // big one--strip code that will never execute
                            drop_debugger: true,
                            conditionals: true,
                            evaluate: true,
                            drop_console: true, // strips console statements
                            sequences: true,
                            booleans: true,
                        }
                    }
                }),
            ],
            usedExports: true,
            mangleWasmImports: true,
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
               styles: {
                 minSize: 0, //Ignore minSize for CSS files, to force them
                 // in new chunks
                 test: /\.(c|sa|sc)ss$/,
                 reuseExistingChunk: true,
                 enforce: true,
               },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                minSize: 7000,
                enforce: true,
                name(module) {
                  // get the name. E.g. node_modules/packageName/not/this/part.js
                  // or node_modules/packageName
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `vendors/${packageName.replace('@', '')}`;
                },
              },
            },
          },
            },
        plugins: [
            new CleanWebpackPlugin({
              cleanOnceBeforeBuildPatterns: [
                path.resolve(__dirname, `../../build/site/`),
              ],}),
            new webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
              ignoreOrder: true,
    filename: "css/[name].[contenthash:8].css",
    chunkFilename: "css/[name].[contenthash:8].css"
  }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new UnCSSPlugin(),
            new CompressionPlugin({
              minRatio: 1,
              filename: '../compressed/[path]',
              test: /\.(html|css|js|jpeg|jpg|png|pdf|woff|eot|ttf)$/,
            }),
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../../../src/documentation/bundleSizeReporting/bundle-reports.html'
          })
        ],
    })
