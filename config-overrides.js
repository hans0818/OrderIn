const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "timers": require.resolve("timers-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer")
  };
  
  // Buffer 폴리필을 위한 플러그인 추가
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
}; 