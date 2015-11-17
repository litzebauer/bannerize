var assert = require('assert');
var cpr = require('cpr');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var bannerize = require('../index');

var YEAR = String(new Date().getFullYear());

function read(f) {
  return fs.readFileSync(f, {encoding: 'utf8'}).trim();
}

function contents(c) {
  return Array.isArray(c) ? c.join('\n') : c;
}

describe('bannerize', function () {

  beforeEach(function (done) {

    // Need to run tests within a copy of the fixtures directory.
    cpr('test/fixtures', 'test/tmp', {confirm: true}, function (err, files) {
      process.chdir('test/tmp');
      done();
    });
  });

  afterEach(function (done) {
    process.chdir('../..');
    rimraf('test/tmp', done);
  });

  it('can bannerize a single file in the cwd', function () {
    return bannerize('*.js').then(function () {

      assert.equal(read('main.js'), contents([
        '// Project is: bannerize',
        '(function(){}());'
      ]));
    });
  });

  it('can bannerize multiple files in the cwd', function () {
    return bannerize(['*.css', '*.js']).then(function () {

      assert.equal(read('main.js'), contents([
        '// Project is: bannerize',
        '(function(){}());'
      ]));

      assert.equal(read('main.css'), contents([
        '// Project is: bannerize',
        'body{font-family:Times;}'
      ]));
    });
  });

  it('supports a custom `banner` option', function () {
    return bannerize('*.js', {banner: 'subdir/banner.ejs'}).then(function () {

      assert.equal(read('main.js'), contents([
        '// It is the year ' + YEAR,
        '(function(){}());'
      ]));
    });
  });

  it('supports a `cwd` option', function () {
    return bannerize(['*.css', '*.js'], {cwd: 'subdir'}).then(function () {

      assert.equal(read('subdir/app.js'), contents([
        '// It is the year ' + YEAR,
        'console.log(\'app.js\');'
      ]));

      assert.equal(read('subdir/app.css'), contents([
        '// It is the year ' + YEAR,
        'body{font-family:sans-serif;}'
      ]));
    });
  });
});
