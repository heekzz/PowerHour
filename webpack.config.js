const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: path.join(__dirname, 'frontend', 'app-client.js'),
	output: {
		path: path.join(__dirname, 'frontend', 'public', 'js'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: path.join(__dirname),
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: 'babel_cache',
							presets: ['react', 'es2015'],
							sourceMap: true
						}
					}
				]
			}
		]
	},
	devtool: 'inline-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		]
};