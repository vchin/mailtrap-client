module.exports = {
  "roots": [
    "<rootDir>/src",
    "<rootDir>/integration-tests",
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  "collectCoverage": true,
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/main.ts",
    "!src/__MOCKS__/*.ts",
  ],
  "setupTestFrameworkScriptFile": "<rootDir>/jest.setup.js"
};
