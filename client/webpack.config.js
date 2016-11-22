var webpack = require('webpack');
var DotenvPlugin = require('webpack-dotenv-plugin');


module.exports = {
    target: 'web',
    cache: true,
    entry: './src/app.jsx',
    output: {
        path: './dist',
        filename: 'bundle.js',
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                },
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            {
                test: /\.html$/,
                loader: 'html',
            },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
            { test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
        ],
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new DotenvPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify(process.env.ENV || 'development'),
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compressor: {
                warnings: false,
            },
        }),
    ],

    debug: false,
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        historyApiFallback: true,
    },
};
