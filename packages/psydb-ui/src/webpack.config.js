'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    mode: 'development',
    entry: './index.js',
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
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                        ],
                    }
                }]
            }
        ]
    },
    plugins: [
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
