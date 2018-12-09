module.exports = {
  'extends': [
    'airbnb-base',
    'prettier'
  ],
  'plugins': [
    'prettier'
  ],
  "globals": {
    "fetch": false
  },
  "env": {
    "jest": true
  },
  'rules': {
    'camelcase': 1,
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'bracketSpacing': true,
        'jsxBracketSameLine': true
      }
    ],
    'consistent-return': 'off',
    'global-require': 'off',
    'indent': 'off',
    'prefer-destructuring': 'off',
    'max-len': [
      'error',
      100,
      4,
      {
        'ignoreUrls': true
      }
    ],
    'no-console': 0,
    'no-plusplus': 0,
    'no-fallthrough': 0,
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1,
        'maxEOF': 1,
        'maxBOF': 0
      }
    ],
    'no-nested-ternary': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 0,
    'no-confusing-arrow': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': [2, { ignore: ['^shared','^pages'] }]
  }
};
