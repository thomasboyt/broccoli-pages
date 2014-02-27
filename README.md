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

var MarkdownPages = require('broccoli-pages').MarkdownPages,
    HTMLPages = require('broccoli-pages').HTMLPages;

module.exports = function(broccoli) {

  var example = broccoli.makeTree('example/content'),
      options = {
        templates: './example/templates', // path to templates directory
        helpers: './example/helpers', // path to helpers directory
        globals: {
          message: "Hello World!"
        }
      };

  example = HTMLPages(example, options);
  example = MarkdownPages(example, options);

  return example;

};

```

You can see an example [Brocfile.js](Brocfile.js) and [example](example) directory.