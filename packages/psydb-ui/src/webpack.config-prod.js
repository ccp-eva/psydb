'use strict';
const { DefinePlugin } = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

// NOTE: using latest commit as UI build version
// this will prompt the user to reload UI even though it might not
// have actually changed
// im not sure how to best approach this; maybe we can have a placeholder
// js var in index.html and thed sed -i /// with
// sha256sum dist/*.js src/template.html | sha256sum
const UI_BUILD_VERSION = (
    require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim()
);

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
    plugins: [
        new DefinePlugin({
            '__BUNDLE_VERSION__': JSON.stringify(UI_BUILD_VERSION),
        }),
        new WebpackManifestPlugin({
            seed: { version: UI_BUILD_VERSION }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './template.html'),
            title: 'psydb',
        }),
        new CompressionPlugin(),
    ]
};
