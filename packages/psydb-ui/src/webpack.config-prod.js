'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    context: __dirname,
    mode: 'production',
    entry: './index.js',
    devtool: false,
    output: {
        //path: path.resolve(__dirname, 'dist'),
        path: path.resolve(__dirname, '../dist'),
        publicPath: '',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!@mpieva)/,
                use: [{
                    loader: 'babel-loader',
                    // FIXME: if i leave this out babel leader
                    // complains about 'jsx not being enabled'
                    // so i suspect the config in package json is not
                    // applied for some reason
                    // https://stackoverflow.com/q/62703393/1158560
                    // we might want to move to babel.config.js
                    // so idk
                    options: {
                        presets: [
                          [
                            "@babel/preset-react",
                            {}
                          ],
                          [
                            "@babel/preset-env",
                            {
                              "targets": "> 0.25%, not dead"
                            }
                          ]
                        ],
                    }
                }]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './template.html'),
            title: 'psydb',
        }),
        new CompressionPlugin(),
    ]
};
