const path = require('path');

module.exports = {
  entry: './main.js', // your main JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};