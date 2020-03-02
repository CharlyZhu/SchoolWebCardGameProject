const path = require("path");
const webpack = require("webpack");
module.exports =
{

    "mode": "development",
    "entry": ["@babel/polyfill","./src/index.ts"],
    "output": {
        "path": path.resolve("./"),
        "filename": "dist/index.js"
    },
    "module": {
        "rules": [
            {
                "test":/\.ts$|\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "@babel/preset-env"
                        ]
                    }
                }
            }
        ]
    },
    "devServer": {"contentBase" : "./"},
    "resolve": {
        "extensions" : [".js", ".ts"]
    }
};