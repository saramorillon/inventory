const configFile = 'tsconfig.build.json'

module.exports = {
  entry: 'src/index',
  plugins: [{ resolve: '@poi/plugin-typescript', options: { configFile } }],
  devServer: { proxy: { '/api': 'http://localhost:3000' } },
}
