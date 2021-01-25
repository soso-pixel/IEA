//-------------------------------------------------------------------------------
// This is the config file that is shared both by the dev and prod config. It
// is merged with each specific config.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

const path = require('path')
const HtmlWebpackPlugin = require('/usr/local/lib/node_modules/html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\/animation\.|\.pdf/,
        loader: 'file-loader',
        options: {
          name: (name) => {
            let ext = name.split('.');
            ext = ext[ext.length - 1]
            switch (ext) {
                case 'pdf':
                case 'doc':
                    ext = 'documents';
                    break;
                default:
                    ext = 'animation';
            }
            return `${ext}/[name].[ext]`;
          },
          outputPath: "assets"
        },
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'babel-loader', options: { configFile: path.resolve(__dirname,'../babel.config.js')}  },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
              svgo: {
                plugins: [
                  {"inlineStyles": { "onlyMatchedOnce": false }}
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
            options: {
              fallback: true,
              name: 'js/workers/worker.[hash].js'
            }
          }
      },
    ]},
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template:path.resolve(__dirname,'../../src/index-template.html'),
    })
    ],
  resolve: {
    alias: {
      'shared-globals': path.resolve(__dirname, '../../src/shared-globals.scss'),
    },
    extensions: ['.js', '.jsx']
  },
  resolveLoader: {
    alias: {
    }
  },
}
