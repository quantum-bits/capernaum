module.exports = {
  parser: "@typescript-eslint/parser",

  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },

  plugins: ["@typescript-eslint/eslint-plugin"],

  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],

  root: true,

  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: [".eslintrc.js"],

  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    // Typescript infers these.
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },

  // These are old-ish ones. Still needed?
  // // Allow properties to be declared in constructor.
  // "@typescript-eslint/no-parameter-properties": "off",
  // // Runs afoul of fat arrow functions in decorators.
  // "@typescript-eslint/no-unused-vars": "off",
  // // Rely on default accessibility rules.
  // "@typescript-eslint/explicit-member-accessibility": "off",
};
