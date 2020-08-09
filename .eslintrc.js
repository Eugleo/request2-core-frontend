module.exports = {
  extends: ['airbnb-typescript-prettier'],
  rules: {
    'import/no-unresolved': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-underscore-dangle': 0,
    'import/extensions': 0,
    'react/jsx-props-no-spreading': [
      1,
      { exceptions: ['input', 'textarea', 'components.Placeholder', 'components.Control'] },
    ],
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'prettier/prettier': 'error',
    'react/button-has-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'no-extend-native': ['error', { exceptions: ['Array'] }],
  },
};
