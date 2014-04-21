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
