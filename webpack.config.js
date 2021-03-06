module.exports = {
    entry: "./ts/expressions-ts.ts",
    output: {
    	filename: "./js/expressions-ts.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
    },

    ts: {
        "compilerOptions": {
            "noEmit": false
        }
    }
};
