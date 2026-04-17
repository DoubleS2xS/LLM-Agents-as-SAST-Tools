module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "AssignmentExpression[left.type='MemberExpression'][left.property.name='innerHTML']",
        message: "Potential DOM XSS sink: assignment to innerHTML.",
      },
      {
        selector:
          "CallExpression[callee.type='MemberExpression'][callee.property.name='insertAdjacentHTML']",
        message: "Potential DOM XSS sink: insertAdjacentHTML call.",
      },
      {
        selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
        message: "Potential DOM XSS sink: dangerouslySetInnerHTML usage.",
      },
      {
        selector: "JSXAttribute[name.name='srcDoc']",
        message: "Potential DOM XSS sink: iframe srcDoc usage.",
      }
    ]
  }
};

