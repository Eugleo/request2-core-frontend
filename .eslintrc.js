module.exports = {
  extends: ['galex'],
  overrides: [
    {
      files: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.jsx', 'src/**/*.tsx'],
    },
  ],
  rules: {
    // '@typescript-eslint/explicit-function-return-type': 0,
    // '@typescript-eslint/no-unused-vars': 'off',
    // '@typescript-eslint/no-use-before-define': 0,
    // 'import/extensions': 0,
    'import/no-namespace': 0,
    // 'import/order': 'off',
    // 'import/prefer-default-export': 0,
    // 'no-extend-native': ['error', { exceptions: ['Array'] }],
    // 'no-underscore-dangle': 0,
    'react/button-has-type': 0,
    'sonarjs/no-duplicate-string': 0,
    'unicorn/prefer-spread':0,
    'unicorn/no-new-array':0,
    // 'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    // 'react/jsx-props-no-spreading': [
    //   1,
    //   { exceptions: ['input', 'textarea', 'components.Placeholder', 'components.Control'] },
    // ],
    // 'react/no-unescaped-entities': 0,
    // 'react/prop-types': 0,
  },
};
