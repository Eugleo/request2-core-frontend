module.exports = {
  extends: ['airbnb-typescript-prettier'],
  rules: {
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
  },
};
