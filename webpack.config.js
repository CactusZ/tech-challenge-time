/* eslint-disable @typescript-eslint/no-var-requires */

const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    context: path.resolve(__dirname, "frontend", "src"),
    entry: "./main.ts",
    output: {
        path: path.resolve(__dirname, "compiled", "dist")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["vue-style-loader", "css-loader", "less-loader"] // compiles Less to CSS
            },
            {
                test: /\.(png|jpg|gif|woff|ttf)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(
                __dirname,
                "frontend",
                "public",
                "index.html"
            )
        })
    ],
    resolve: {
        extensions: [".ts", ".js", ".json"],
        alias: {
            "@schemas": path.resolve(__dirname, "schemas")
        }
    }
};
