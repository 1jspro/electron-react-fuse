const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  entry: "./src/index.js",
  target: "electron-renderer",
  output: {
    clean: true,
    filename: "bundle.js",
    chunkFilename: (pathData) => {
      return pathData.chunk.name === "main"
        ? "[name].js"
        : "dist/[contenthash:16].js";
    },
    hotUpdateChunkFilename: "dist/[contenthash:16].hot-update.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          globOptions: { ignore: ["**/index.html"] },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
  ],
  resolve: {
    modules: ["src", "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", { modules: false }],
            "@babel/preset-react",
          ],
          plugins: ["react-require"],
        },
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
    config.watch = true;
  }
  return config;
};
