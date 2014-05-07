var MarkdownPages = require('./lib/index').MarkdownPages;
var HTMLPages = require('./lib/index').HTMLPages;
var HBSPages = require('./lib/index').HBSPages;
var pickFiles = require('broccoli-static-compiler');

var options = {
  templates: './example/templates',
  helpers: './example/helpers',
  partials: './example/templates/partials',
  globals: {
    message: "Hello World!",
    team: [ 'Bob', 'Joe', 'Mary' ]
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
var handlebars = HBSPages(rendered, options);

module.exports = handlebars;
