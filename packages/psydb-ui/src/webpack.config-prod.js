'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getBuildVersion = require('./get-build-version');
const CompressionPlugin = require("compression-webpack-plugin");

const enableReadableErrors = false;

module.exports = {
    context: __dirname,
    entry: './index.js',
    
    mode: 'production',
    devtool: 'source-map',
    
    output: {
        //path: path.resolve(__dirname, 'dist'),
        path: path.resolve(__dirname, '../dist'),
        publicPath: '',
        filename: '[name].bundle.[hash].js',
        chunkFilename: '[chunkhash].js'
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
    optimization: {
        ...(enableReadableErrors ? {
            // none
        } : {
            splitChunks: {
                chunks: 'all',
            }
        })
    },
    resolve: {
        mainFields: [ 'browser', 'main' ],
        fallback: {
            "querystring": require.resolve("querystring-es3"),
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __PSYDB_VERSION__: JSON.stringify(getBuildVersion()),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './template.html'),
            title: 'psydb',
        }),
        new CompressionPlugin(),
    ]
};
