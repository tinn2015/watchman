module.exports = {
  "extends": ["eslint:recommended"],
  "env": {
    "node": true,
    "browser": true,
    "commonjs": true,
    "amd": true,
    "es6": true
  },
  // "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
};
