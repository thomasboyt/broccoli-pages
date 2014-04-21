# Broccoli Pages Filter

Allows you to generate HTML from Markdown and HTML fragments. You can specify metadata for each page.
In metadata, you can specify a Handlebars template to be used to wrap this content.

## Example Page
```markdown
---
title: Hello World
description: some text
template: default.hbs
---
**Beautiful World**
```

## Usage

```javascript
var MarkdownPages = require('./lib/index').MarkdownPages;
var HTMLPages = require('./lib/index').HTMLPages;
var pickFiles = require('broccoli-static-compiler');

var options = {
  templates: './example/templates',
  helpers: './example/helpers',
  partials: './example/templates/partials',
  globals: {
    message: "Hello World!"
  }
};

var example = 'example';

var content = pickFiles(example, {
  srcDir: '/content',
  files: ['**/*.*'],
  destDir: '/'
});

var html = HTMLPages(content, options);
var rendered = MarkdownPages(html, options);

module.exports = rendered;
```

You can see an example [Brocfile.js](Brocfile.js) and [example](example) directory.