
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env = {}) => ({
    mode: env.prod ? 'production' : 'development',
    devtool: env.prod ? 'source-map' : 'cheap-module-source-map',
    entry: path.resolve(__dirname, './src/main.ts'),
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/'
    },
    resolve: {
        alias: {
            'vue': '@vue/runtime-dom'
        },
        extensions: ['.vue', '.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }]
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.png$/,
                use: {
                    loader: 'url-loader',
                    options: { limit: 10000 }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    devServer: {
        inline: true,
        hot: true,
        stats: 'minimal',
        contentBase: __dirname,
        overlay: true
    }
})