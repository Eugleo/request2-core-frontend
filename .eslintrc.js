module.exports = {
  plugins: ['simple-import-sort', 'unused-imports'],
  extends: ['airbnb-typescript-prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports-ts': 'error',
    'unused-imports/no-unused-vars-ts': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'import/no-unresolved': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-underscore-dangle': 0,
    'import/extensions': 0,
    'react/jsx-props-no-spreading': [
      1,
      { exceptions: ['input', 'textarea', 'components.Placeholder', 'components.Control'] },
    ],
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'prettier/prettier': 'error',
    'react/button-has-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'no-extend-native': ['error', { exceptions: ['Array'] }],
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.jsx', 'src/**/*.tsx'],
    },
  ],
};
