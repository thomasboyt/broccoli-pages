var MarkdownPages = require('broccoli-pages').MarkdownPages;
var HTMLPages = require('broccoli-pages').HTMLPages;
var HBSPages = require('broccoli-pages').HBSPages;
var pickFiles = require('broccoli-static-compiler');

var options = {
  templates: './templates',
  helpers: './helpers',
  partials: './templates/partials',
  globals: {
    message: "Hello World!",
    team: [ 'Bob', 'Joe', 'Mary' ]
  }
};

var content = pickFiles('content', {
  srcDir: '/',
  files: ['**/*.*'],
  destDir: '/'
});

var html;

html = HTMLPages(content, options);
html = MarkdownPages(html, options);
html = HBSPages(html, options);

module.exports = html;
