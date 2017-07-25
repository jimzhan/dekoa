module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    mocha: true,
  },
  extends: 'standard',
  plugins: [
    'import'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      'babel-module': {},
    }
  },
  // add your custom rules here
  rules: {
    'global-require': 0,
    'class-methods-use-this': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': ['error', 'always', {
      'js': 'never',
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
