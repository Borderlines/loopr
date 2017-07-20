const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const extractCSS = new ExtractTextPlugin('styles/[name].css');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, '../static_dist'),
        historyApiFallback: true,
        compress: true,
        port: 8080,
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                extractCSS.extract('style'),
                'css-loader?localIdentName=[path][name]--[local]',
                'postcss-loader',
            ],
        }, {
            test: /\.scss$/,
            use: [
                extractCSS.extract('style'),
                {
                    loader: 'css-loader',
                    options: {
                        localIdentName: '[path][name]--[local]',
                        sourceMap: false,
                        context: '/',
                    },
                },
                'postcss-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        data: `@import "${__dirname}/../app/l8pr/static/styles/config/_variables.scss";`,
                        context: '/',
                    },
                },
            ],
        }],
    },

    plugins: [
        extractCSS,
    ]
};
