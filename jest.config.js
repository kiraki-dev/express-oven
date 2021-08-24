module.exports = {
  "roots": [
    "<rootDir>/tests",
  ],
  globals: {
    extensionsToTreatAsEsm: ['.ts', '.js', '.tsx'],
    'ts-jest': {
      useESM: true
    }
  },

  preset: 'ts-jest/presets/js-with-ts-esm',

  transformIgnorePatterns: [
    'node_modules/(?!(light-uid)/)'
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  // "transform": {
  //   "^.+\\.(js|ts|tsx)$": "ts-jest/presets/js-with-ts-esm",
  // },
};
