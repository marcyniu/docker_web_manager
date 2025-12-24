const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/client/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist/client'),
      filename: 'bundle.[contenthash].js',
      publicPath: isProduction ? '/static/' : '/',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/client/index.html',
        filename: 'index.html'
      }),
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'styles.[contenthash].css'
        })
      ] : [])
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist/client')
      },
      port: 3001,
      hot: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      ]
    }
  };
};
