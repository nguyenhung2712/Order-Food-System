const webpack = require("webpack");

module.exports = {
    entry: {
        hot: 'webpack/hot/dev-server.js',
        client: 'webpack-dev-server/client/index.js?hot=true&live-reload=true',
    },
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel-loader"],
        }
    ],
    devServer: {
        hot: true,
        client: false,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
}