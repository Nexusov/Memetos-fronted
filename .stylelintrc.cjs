module.exports = {
  "plugins": ["stylelint-scss"],
  "rules": {
    "selector-class-pattern": ["^[a-z][a-zA-Z0-9]+$", {
      "message": "Class should be named in camelCase"
    }]
  },
  "overrides": [
    {
      "files": ["src/**/*.scss"],
      "customSyntax": "postcss-scss"
    }
  ]
}
