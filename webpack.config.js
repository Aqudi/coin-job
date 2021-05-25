const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: 'development',
    entry: "./src/index.js",
    output: {
        filename: "src/index.js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: 'umd',
        library: 'App'
    },
    plugins: [
        new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            jQuery: 'jquery'
        }),
    ],
};