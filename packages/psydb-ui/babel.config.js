module.exports = {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          'targets': '> 0.25%, not dead'
        }
      ]
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties'
    ],
    ignore: [
        'src/server'
    ],
}
