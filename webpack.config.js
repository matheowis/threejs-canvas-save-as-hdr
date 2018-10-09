const path = require('path');

module.exports = {
  entry: './src/app.js',
  module:{
    rules:[
      {
        test: /(\.glsl|\.vs|\.fs)$/,
        exclude: /node_modules/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
  }
}