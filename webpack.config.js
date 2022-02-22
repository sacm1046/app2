const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const packageJsonDeps = require('./package.json').dependencies;
const path = require('path');

module.exports = {
  entry: './src/index',
  devServer: {
    open: true,
    port: 3002,
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-react',
              {
                runtime: 'automatic'
              }
            ]
          ],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  plugins: [
    // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
    new ModuleFederationPlugin({
      name: 'app2',
      filename: 'remoteEntry.js',
      exposes: {
        './Card': './src/components/Card',
        './Navbar': './src/components/Navbar',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: packageJsonDeps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: packageJsonDeps["react-dom"] 
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
