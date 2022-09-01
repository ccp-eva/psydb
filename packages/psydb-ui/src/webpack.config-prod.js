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
