// shared config (dev and prod)
const {resolve} = require( 'path' )
const {CheckerPlugin} = require( 'awesome-typescript-loader' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const WorkboxPlugin = require( 'workbox-webpack-plugin' )
const EnvironmentPlugin = require( 'webpack/lib/EnvironmentPlugin' )

const env = process.env.NODE_ENV || 'development'

function resolvePath( dir ) {
  return resolve( __dirname, '../../../', dir )
}

const target = process.env.TARGET || 'web'
const isCordova = target === 'cordova'
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  context: resolvePath( 'src' ),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'source-map-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx|jsx)?$/,
        use: ['babel-loader', 'awesome-typescript-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', {loader: 'css-loader', options: {importLoaders: 1}}],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {importLoaders: 1}},
          'sass-loader',
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]',

        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin( [
      'REACT_APP_KEYCLOAK_REALM',
      'REACT_APP_KEYCLOAK_URL',
      'REACT_APP_KEYCLOAK_CLIENT_ID',
      'PERGOLA_API_URL',
      'PERGOLA_APP_URL',
      'NODE_ENV',
      'WEBDAV_URL',
      'TARGET',
    ] ),
    new CheckerPlugin(),
    new HtmlWebpackPlugin( {
      filename: 'index.html',
      template: resolvePath( 'src/index.ejs' ),
      inject: true,
      minify: env === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      } : false,
    } ),
    new CopyWebpackPlugin( {
      patterns: [
        {
          noErrorOnMissing: true,
          from: resolvePath( 'src/static' ),
          to: resolvePath( isCordova ? 'cordova/www/static' : 'www/static' ),
        },
        {
          noErrorOnMissing: false,
          from: resolvePath( 'public/site.webmanifest' ),
          to: resolvePath( 'www/site.webmanifest' ),
        },
      ],
    } ),
  ],
  performance: {
    hints: false,
  },
}
