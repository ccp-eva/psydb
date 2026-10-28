'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getBuildVersion = require('./get-build-version');

module.exports = {
    context: __dirname,
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './index-isolation.js',
    output: {
        //path: path.resolve(__dirname, 'dist'),
        path: path.resolve(__dirname, '../dist'),
        publicPath: '',
        filename: 'bundle.js'
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
                }]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 15000,
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __PSYDB_VERSION__: JSON.stringify(getBuildVersion()),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './template.html'),
            title: 'psydb',
        }),
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3012',
                secure: false,
                pathRewrite: { '^/api': '' },
            }
        }
    },
};
