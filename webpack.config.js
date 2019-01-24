// webpack v4
const path                  = require('path');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const WebpackMd5Hash        = require('webpack-md5-hash');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const StyleLintPlugin       = require('stylelint-webpack-plugin');
const LiveReloadPlugin      = require('webpack-livereload-plugin');
const CopyWebpackPlugin     = require('copy-webpack-plugin');

module.exports = {
    entry: { main: './src/js/index.js' },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.s[c|a]ss$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|json)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve(__dirname, "src/"),
                            outputPath: 'public/',
                            publicPath: '../',
                            useRelativePaths: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('public', {}),
        new MiniCssExtractPlugin({
            filename: 'css/index.css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/html/chat.html',
            filename: 'chat.html'
        }),
        new WebpackMd5Hash(),
        new LiveReloadPlugin(),
        new CopyWebpackPlugin([
            { from: './src/js/embed.js', to: 'embed.js', flatten: true },
            { from: './src/js/client.js', to: 'client.js', flatten: true },
            { from: './src/img/*', to: 'img/', flatten: true },
            { from: './src/json/*', to: 'json/', flatten: true }
        ])
    ]
};