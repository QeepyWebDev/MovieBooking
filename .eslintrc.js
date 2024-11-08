module.exports = {
    extends: [
      'airbnb-base',
      'plugin:import/errors',
      'plugin:import/warnings',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    env: {
      browser: true,
      node: true,
      es2020: true,
    },
    rules: {
      'import/no-unresolved': 'error',
    },
  };