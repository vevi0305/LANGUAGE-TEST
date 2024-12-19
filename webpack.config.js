const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true, // Clean the output folder before each build
  },
  mode: "development", // Change to 'production' for production builds
  devServer: {
    static: "./dist",
    hot: true, // Enable HMR
    open: true, // Automatically open the browser
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.json$/,
        type: "json", // Use JSON loader
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"], // Tailwind CSS
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"], // Support importing JS and JSX
  },
};
