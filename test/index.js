var tap = require('tap');
var test = tap.test;
var semver = require('../semver.js');
var eq = semver.eq;
var gt = semver.gt;
var lt = semver.lt;
var neq = semver.neq;
var cmp = semver.cmp;
var gte = semver.gte;
var lte = semver.lte;
var satisfies = semver.satisfies;
var validRange = semver.validRange;
var inc = semver.inc;
var replaceStars = semver.replaceStars;
var toComparators = semver.toComparators;
var SemVer = semver.SemVer;
var Range = semver.Range;

test('\ncomparison tests', function(t) {
  // [version1, version2]
  // version1 should be greater than version2
  [['0.0.0', '0.0.0-foo'],
    ['0.0.1', '0.0.0'],
    ['1.0.0', '0.9.9'],
    ['0.10.0', '0.9.0'],
    ['0.99.0', '0.10.0'],
    ['2.0.0', '1.2.3'],
    ['v0.0.0', '0.0.0-foo', true],
    ['v0.0.1', '0.0.0', true],
    ['v1.0.0', '0.9.9', true],
    ['v0.10.0', '0.9.0', true],
    ['v0.99.0', '0.10.0', true],
    ['v2.0.0', '1.2.3', true],
    ['0.0.0', 'v0.0.0-foo', true],
    ['0.0.1', 'v0.0.0', true],
    ['1.0.0', 'v0.9.9', true],
    ['0.10.0', 'v0.9.0', true],
    ['0.99.0', 'v0.10.0', true],
    ['2.0.0', 'v1.2.3', true],
    ['1.2.3', '1.2.3-asdf'],
    ['1.2.3', '1.2.3-4'],
    ['1.2.3', '1.2.3-4-foo'],
    ['1.2.3-5-foo', '1.2.3-5'],
    ['1.2.3-5', '1.2.3-4'],
    ['1.2.3-5-foo', '1.2.3-5-Foo'],
    ['3.0.0', '2.7.2+asdf'],
    ['1.2.3-a.10', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a'],
    ['1.2.3-a.b.c.10.d.5', '1.2.3-a.b.c.5.d.100']
  ].forEach(function(v) {
    var v0 = v[0];
    var v1 = v[1];
    var loose = v[2];
    t.ok(gt(v0, v1, loose), "gt('" + v0 + "', '" + v1 + "')");
    t.ok(lt(v1, v0, loose), "lt('" + v1 + "', '" + v0 + "')");
    t.ok(!gt(v1, v0, loose), "!gt('" + v1 + "', '" + v0 + "')");
    t.ok(!lt(v0, v1, loose), "!lt('" + v0 + "', '" + v1 + "')");
    t.ok(eq(v0, v0, loose), "eq('" + v0 + "', '" + v0 + "')");
    t.ok(eq(v1, v1, loose), "eq('" + v1 + "', '" + v1 + "')");
    t.ok(neq(v0, v1, loose), "neq('" + v0 + "', '" + v1 + "')");
    t.ok(cmp(v1, '==', v1, loose), "cmp('" + v1 + "' == '" + v1 + "')");
    t.ok(cmp(v0, '>=', v1, loose), "cmp('" + v0 + "' >= '" + v1 + "')");
    t.ok(cmp(v1, '<=', v0, loose), "cmp('" + v1 + "' <= '" + v0 + "')");
    t.ok(cmp(v0, '!=', v1, loose), "cmp('" + v0 + "' != '" + v1 + "')");
  });
  t.end();
});

test('\nequality tests', function(t) {
  // [version1, version2]
  // version1 should be equivalent to version2
  [['1.2.3', 'v1.2.3', true],
    ['1.2.3', '=1.2.3', true],
    ['1.2.3', 'v 1.2.3', true],
    ['1.2.3', '= 1.2.3', true],
    ['1.2.3', ' v1.2.3', true],
    ['1.2.3', ' =1.2.3', true],
    ['1.2.3', ' v 1.2.3', true],
    ['1.2.3', ' = 1.2.3', true],
    ['1.2.3-0', 'v1.2.3-0', true],
    ['1.2.3-0', '=1.2.3-0', true],
    ['1.2.3-0', 'v 1.2.3-0', true],
    ['1.2.3-0', '= 1.2.3-0', true],
    ['1.2.3-0', ' v1.2.3-0', true],
    ['1.2.3-0', ' =1.2.3-0', true],
    ['1.2.3-0', ' v 1.2.3-0', true],
    ['1.2.3-0', ' = 1.2.3-0', true],
    ['1.2.3-1', 'v1.2.3-1', true],
    ['1.2.3-1', '=1.2.3-1', true],
    ['1.2.3-1', 'v 1.2.3-1', true],
    ['1.2.3-1', '= 1.2.3-1', true],
    ['1.2.3-1', ' v1.2.3-1', true],
    ['1.2.3-1', ' =1.2.3-1', true],
    ['1.2.3-1', ' v 1.2.3-1', true],
    ['1.2.3-1', ' = 1.2.3-1', true],
    ['1.2.3-beta', 'v1.2.3-beta', true],
    ['1.2.3-beta', '=1.2.3-beta', true],
    ['1.2.3-beta', 'v 1.2.3-beta', true],
    ['1.2.3-beta', '= 1.2.3-beta', true],
    ['1.2.3-beta', ' v1.2.3-beta', true],
    ['1.2.3-beta', ' =1.2.3-beta', true],
    ['1.2.3-beta', ' v 1.2.3-beta', true],
    ['1.2.3-beta', ' = 1.2.3-beta', true],
    ['1.2.3-beta+build', ' = 1.2.3-beta+otherbuild', true],
    ['1.2.3+build', ' = 1.2.3+otherbuild', true],
    ['1.2.3-beta+build', '1.2.3-beta+otherbuild'],
    ['1.2.3+build', '1.2.3+otherbuild'],
    ['  v1.2.3+build', '1.2.3+otherbuild']
  ].forEach(function(v) {
    var v0 = v[0];
    var v1 = v[1];
    var loose = v[2];
    t.ok(eq(v0, v1, loose), "eq('" + v0 + "', '" + v1 + "')");
    t.ok(!neq(v0, v1, loose), "!neq('" + v0 + "', '" + v1 + "')");
    t.ok(cmp(v0, '==', v1, loose), 'cmp(' + v0 + '==' + v1 + ')');
    t.ok(!cmp(v0, '!=', v1, loose), '!cmp(' + v0 + '!=' + v1 + ')');
    t.ok(!cmp(v0, '===', v1, loose), '!cmp(' + v0 + '===' + v1 + ')');
    t.ok(cmp(v0, '!==', v1, loose), 'cmp(' + v0 + '!==' + v1 + ')');
    t.ok(!gt(v0, v1, loose), "!gt('" + v0 + "', '" + v1 + "')");
    t.ok(gte(v0, v1, loose), "gte('" + v0 + "', '" + v1 + "')");
    t.ok(!lt(v0, v1, loose), "!lt('" + v0 + "', '" + v1 + "')");
    t.ok(lte(v0, v1, loose), "lte('" + v0 + "', '" + v1 + "')");
  });
  t.end();
});


test('\nrange tests', function(t) {
  // [range, version]
  // version should be included by range
  [['1.0.0 - 2.0.0', '1.2.3'],
    ['1.0.0', '1.0.0'],
    ['>=*', '0.2.4'],
    ['', '1.0.0'],
    ['*', '1.2.3'],
    ['*', 'v1.2.3-foo', true],
    ['>=1.0.0', '1.0.0'],
    ['>=1.0.0', '1.0.1'],
    ['>=1.0.0', '1.1.0'],
    ['>1.0.0', '1.0.1'],
    ['>1.0.0', '1.1.0'],
    ['<=2.0.0', '2.0.0'],
    ['<=2.0.0', '1.9999.9999'],
    ['<=2.0.0', '0.2.9'],
    ['<2.0.0', '1.9999.9999'],
    ['<2.0.0', '0.2.9'],
    ['>= 1.0.0', '1.0.0'],
    ['>=  1.0.0', '1.0.1'],
    ['>=   1.0.0', '1.1.0'],
    ['> 1.0.0', '1.0.1'],
    ['>  1.0.0', '1.1.0'],
    ['<=   2.0.0', '2.0.0'],
    ['<= 2.0.0', '1.9999.9999'],
    ['<=  2.0.0', '0.2.9'],
    ['<    2.0.0', '1.9999.9999'],
    ['<\t2.0.0', '0.2.9'],
    ['>=0.1.97', 'v0.1.97', true],
    ['>=0.1.97', '0.1.97'],
    ['0.1.20 || 1.2.4', '1.2.4'],
    ['>=0.2.3 || <0.0.1', '0.0.0'],
    ['>=0.2.3 || <0.0.1', '0.2.3'],
    ['>=0.2.3 || <0.0.1', '0.2.4'],
    ['||', '1.3.4'],
    ['2.x.x', '2.1.3'],
    ['1.2.x', '1.2.3'],
    ['1.2.x || 2.x', '2.1.3'],
    ['1.2.x || 2.x', '1.2.3'],
    ['x', '1.2.3'],
    ['2.*.*', '2.1.3'],
    ['1.2.*', '1.2.3'],
    ['1.2.* || 2.*', '2.1.3'],
    ['1.2.* || 2.*', '1.2.3'],
    ['*', '1.2.3'],
    ['2', '2.1.2'],
    ['2.3', '2.3.1'],
    ['~2.4', '2.4.0'], // >=2.4.0 <2.5.0
    ['~2.4', '2.4.5'],
    ['~>3.2.1', '3.2.2'], // >=3.2.1 <3.3.0,
    ['~1', '1.2.3'], // >=1.0.0 <2.0.0
    ['~>1', '1.2.3'],
    ['~> 1', '1.2.3'],
    ['~1.0', '1.0.2'], // >=1.0.0 <1.1.0,
    ['~ 1.0', '1.0.2'],
    ['~ 1.0.3', '1.0.12'],
    ['>=1', '1.0.0'],
    ['>= 1', '1.0.0'],
    ['<1.2', '1.1.1'],
    ['< 1.2', '1.1.1'],
    ['1', '1.0.0beta', true],
    ['~v0.5.4-pre', '0.5.5'],
    ['~v0.5.4-pre', '0.5.4'],
    ['=0.7.x', '0.7.2'],
    ['>=0.7.x', '0.7.2'],
    ['=0.7.x', '0.7.0-asdf'],
    ['>=0.7.x', '0.7.0-asdf'],
    ['<=0.7.x', '0.6.2'],
    ['~1.2.1 >=1.2.3', '1.2.3'],
    ['~1.2.1 =1.2.3', '1.2.3'],
    ['~1.2.1 1.2.3', '1.2.3'],
    ['~1.2.1 >=1.2.3 1.2.3', '1.2.3'],
    ['~1.2.1 1.2.3 >=1.2.3', '1.2.3'],
    ['~1.2.1 1.2.3', '1.2.3'],
    ['>=1.2.1 1.2.3', '1.2.3'],
    ['1.2.3 >=1.2.1', '1.2.3'],
    ['>=1.2.3 >=1.2.1', '1.2.3'],
    ['>=1.2.1 >=1.2.3', '1.2.3'],
    ['<=1.2.3', '1.2.3-beta'],
    ['>1.2', '1.3.0-beta'],
    ['>=1.2', '1.2.8'],
    ['^1.2.3', '1.8.1'],
    ['^1.2.3', '1.2.3-beta'],
    ['^0.1.2', '0.1.2'],
    ['^0.1', '0.1.2'],
    ['^1.2', '1.4.2'],
    ['^1.2 ^1', '1.4.2']
  ].forEach(function(v) {
    var range = v[0];
    var ver = v[1];
    var loose = v[2];
    t.ok(satisfies(ver, range, loose), range + ' satisfied by ' + ver);
  });
  t.end();
});

test('\nnegative range tests', function(t) {
  // [range, version]
  // version should not be included by range
  [['1.0.0 - 2.0.0', '2.2.3'],
    ['1.0.0', '1.0.1'],
    ['>=1.0.0', '0.0.0'],
    ['>=1.0.0', '0.0.1'],
    ['>=1.0.0', '0.1.0'],
    ['>1.0.0', '0.0.1'],
    ['>1.0.0', '0.1.0'],
    ['<=2.0.0', '3.0.0'],
    ['<=2.0.0', '2.9999.9999'],
    ['<=2.0.0', '2.2.9'],
    ['<2.0.0', '2.9999.9999'],
    ['<2.0.0', '2.2.9'],
    ['>=0.1.97', 'v0.1.93', true],
    ['>=0.1.97', '0.1.93'],
    ['0.1.20 || 1.2.4', '1.2.3'],
    ['>=0.2.3 || <0.0.1', '0.0.3'],
    ['>=0.2.3 || <0.0.1', '0.2.2'],
    ['2.x.x', '1.1.3'],
    ['2.x.x', '3.1.3'],
    ['1.2.x', '1.3.3'],
    ['1.2.x || 2.x', '3.1.3'],
    ['1.2.x || 2.x', '1.1.3'],
    ['2.*.*', '1.1.3'],
    ['2.*.*', '3.1.3'],
    ['1.2.*', '1.3.3'],
    ['1.2.* || 2.*', '3.1.3'],
    ['1.2.* || 2.*', '1.1.3'],
    ['2', '1.1.2'],
    ['2.3', '2.4.1'],
    ['~2.4', '2.5.0'], // >=2.4.0 <2.5.0
    ['~2.4', '2.3.9'],
    ['~>3.2.1', '3.3.2'], // >=3.2.1 <3.3.0
    ['~>3.2.1', '3.2.0'], // >=3.2.1 <3.3.0
    ['~1', '0.2.3'], // >=1.0.0 <2.0.0
    ['~>1', '2.2.3'],
    ['~1.0', '1.1.0'], // >=1.0.0 <1.1.0
    ['<1', '1.0.0'],
    ['>=1.2', '1.1.1'],
    ['1', '2.0.0beta', true],
    ['~v0.5.4-beta', '0.5.4-alpha'],
    ['<1', '1.0.0beta', true],
    ['< 1', '1.0.0beta', true],
    ['=0.7.x', '0.8.2'],
    ['>=0.7.x', '0.6.2'],
    ['<=0.7.x', '0.7.2'],
    ['<1.2.3', '1.2.3-beta'],
    ['=1.2.3', '1.2.3-beta'],
    ['>1.2', '1.2.8'],
    ['^1.2.3', '2.0.0-alpha'],
    ['^1.2.3', '1.2.2'],
    ['^1.2', '1.1.9'],
    // invalid ranges never satisfied!
    ['blerg', '1.2.3'],
    ['git+https://user:password0123@github.com/foo', '123.0.0', true]
  ].forEach(function(v) {
    var range = v[0];
    var ver = v[1];
    var loose = v[2];
    var found = satisfies(ver, range, loose);
    t.ok(!found, ver + ' not satisfied by ' + range);
  });
  t.end();
});

test('\nincrement versions test', function(t) {
  // [version, inc, result]
  // inc(version, inc) -> result
  [['1.2.3', 'major', '2.0.0'],
    ['1.2.3', 'minor', '1.3.0'],
    ['1.2.3', 'patch', '1.2.4'],
    ['1.2.3tag', 'major', '2.0.0', true],
    ['1.2.3-tag', 'major', '2.0.0'],
    ['1.2.3', 'fake', null],
    ['fake', 'major', null],
    ['1.2.3', 'prerelease', '1.2.3-0'],
    ['1.2.3-0', 'prerelease', '1.2.3-1'],
    ['1.2.3-alpha.0', 'prerelease', '1.2.3-alpha.1'],
    ['1.2.3-alpha.1', 'prerelease', '1.2.3-alpha.2'],
    ['1.2.3-alpha.2', 'prerelease', '1.2.3-alpha.3'],
    ['1.2.3-alpha.0.beta', 'prerelease', '1.2.3-alpha.1.beta'],
    ['1.2.3-alpha.1.beta', 'prerelease', '1.2.3-alpha.2.beta'],
    ['1.2.3-alpha.2.beta', 'prerelease', '1.2.3-alpha.3.beta'],
    ['1.2.3-alpha.10.0.beta', 'prerelease', '1.2.3-alpha.10.1.beta'],
    ['1.2.3-alpha.10.1.beta', 'prerelease', '1.2.3-alpha.10.2.beta'],
    ['1.2.3-alpha.10.2.beta', 'prerelease', '1.2.3-alpha.10.3.beta'],
    ['1.2.3-alpha.10.beta.0', 'prerelease', '1.2.3-alpha.10.beta.1'],
    ['1.2.3-alpha.10.beta.1', 'prerelease', '1.2.3-alpha.10.beta.2'],
    ['1.2.3-alpha.10.beta.2', 'prerelease', '1.2.3-alpha.10.beta.3'],
    ['1.2.3-alpha.9.beta', 'prerelease', '1.2.3-alpha.10.beta'],
    ['1.2.3-alpha.10.beta', 'prerelease', '1.2.3-alpha.11.beta'],
    ['1.2.3-alpha.11.beta', 'prerelease', '1.2.3-alpha.12.beta']
  ].forEach(function(v) {
    var pre = v[0];
    var what = v[1];
    var wanted = v[2];
    var loose = v[3];
    var found = inc(pre, what, loose);
    t.equal(found, wanted, 'inc(' + pre + ', ' + what + ') === ' + wanted);
  });

  t.end();
});

test('\nvalid range test', function(t) {
  // [range, result]
  // validRange(range) -> result
  // translate ranges into their canonical form
  [['1.0.0 - 2.0.0', '>=1.0.0 <=2.0.0'],
    ['1.0.0', '1.0.0'],
    ['>=*', '>=0.0.0-0'],
    ['', '*'],
    ['*', '*'],
    ['*', '*'],
    ['>=1.0.0', '>=1.0.0'],
    ['>1.0.0', '>1.0.0'],
    ['<=2.0.0', '<=2.0.0'],
    ['1', '>=1.0.0-0 <2.0.0-0'],
    ['<=2.0.0', '<=2.0.0'],
    ['<=2.0.0', '<=2.0.0'],
    ['<2.0.0', '<2.0.0-0'],
    ['<2.0.0', '<2.0.0-0'],
    ['>= 1.0.0', '>=1.0.0'],
    ['>=  1.0.0', '>=1.0.0'],
    ['>=   1.0.0', '>=1.0.0'],
    ['> 1.0.0', '>1.0.0'],
    ['>  1.0.0', '>1.0.0'],
    ['<=   2.0.0', '<=2.0.0'],
    ['<= 2.0.0', '<=2.0.0'],
    ['<=  2.0.0', '<=2.0.0'],
    ['<    2.0.0', '<2.0.0-0'],
    ['<	2.0.0', '<2.0.0-0'],
    ['>=0.1.97', '>=0.1.97'],
    ['>=0.1.97', '>=0.1.97'],
    ['0.1.20 || 1.2.4', '0.1.20||1.2.4'],
    ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1-0'],
    ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1-0'],
    ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1-0'],
    ['||', '||'],
    ['2.x.x', '>=2.0.0-0 <3.0.0-0'],
    ['1.2.x', '>=1.2.0-0 <1.3.0-0'],
    ['1.2.x || 2.x', '>=1.2.0-0 <1.3.0-0||>=2.0.0-0 <3.0.0-0'],
    ['1.2.x || 2.x', '>=1.2.0-0 <1.3.0-0||>=2.0.0-0 <3.0.0-0'],
    ['x', '*'],
    ['2.*.*', '>=2.0.0-0 <3.0.0-0'],
    ['1.2.*', '>=1.2.0-0 <1.3.0-0'],
    ['1.2.* || 2.*', '>=1.2.0-0 <1.3.0-0||>=2.0.0-0 <3.0.0-0'],
    ['*', '*'],
    ['2', '>=2.0.0-0 <3.0.0-0'],
    ['2.3', '>=2.3.0-0 <2.4.0-0'],
    ['~2.4', '>=2.4.0-0 <2.5.0-0'],
    ['~2.4', '>=2.4.0-0 <2.5.0-0'],
    ['~>3.2.1', '>=3.2.1-0 <3.3.0-0'],
    ['~1', '>=1.0.0-0 <2.0.0-0'],
    ['~>1', '>=1.0.0-0 <2.0.0-0'],
    ['~> 1', '>=1.0.0-0 <2.0.0-0'],
    ['~1.0', '>=1.0.0-0 <1.1.0-0'],
    ['~ 1.0', '>=1.0.0-0 <1.1.0-0'],
    ['^0', '>=0.0.0-0 <1.0.0-0'],
    ['^ 1', '>=1.0.0-0 <2.0.0-0'],
    ['^0.1', '>=0.1.0-0 <0.2.0-0'],
    ['^1.0', '>=1.0.0-0 <2.0.0-0'],
    ['^1.2', '>=1.2.0-0 <2.0.0-0'],
    ['^0.0.1', '=0.0.1'],
    ['^0.0.1-beta', '=0.0.1-beta'],
    ['^0.1.2', '>=0.1.2-0 <0.2.0-0'],
    ['^1.2.3', '>=1.2.3-0 <2.0.0-0'],
    ['^1.2.3-beta.4', '>=1.2.3-beta.4 <2.0.0-0'],
    ['<1', '<1.0.0-0'],
    ['< 1', '<1.0.0-0'],
    ['>=1', '>=1.0.0-0'],
    ['>= 1', '>=1.0.0-0'],
    ['<1.2', '<1.2.0-0'],
    ['< 1.2', '<1.2.0-0'],
    ['1', '>=1.0.0-0 <2.0.0-0'],
    ['>01.02.03', '>1.2.3', true],
    ['>01.02.03', null],
    ['~1.2.3beta', '>=1.2.3-beta <1.3.0-0', true],
    ['~1.2.3beta', null],
    ['^ 1.2 ^ 1', '>=1.2.0-0 <2.0.0-0 >=1.0.0-0 <2.0.0-0']
  ].forEach(function(v) {
    var pre = v[0];
    var wanted = v[1];
    var loose = v[2];
    var found = validRange(pre, loose);

    t.equal(found, wanted, 'validRange(' + pre + ') === ' + wanted);
  });

  t.end();
});

test('\ncomparators test', function(t) {
  // [range, comparators]
  // turn range into a set of individual comparators
  [['1.0.0 - 2.0.0', [['>=1.0.0', '<=2.0.0']]],
    ['1.0.0', [['1.0.0']]],
    ['>=*', [['>=0.0.0-0']]],
    ['', [['']]],
    ['*', [['']]],
    ['*', [['']]],
    ['>=1.0.0', [['>=1.0.0']]],
    ['>=1.0.0', [['>=1.0.0']]],
    ['>=1.0.0', [['>=1.0.0']]],
    ['>1.0.0', [['>1.0.0']]],
    ['>1.0.0', [['>1.0.0']]],
    ['<=2.0.0', [['<=2.0.0']]],
    ['1', [['>=1.0.0-0', '<2.0.0-0']]],
    ['<=2.0.0', [['<=2.0.0']]],
    ['<=2.0.0', [['<=2.0.0']]],
    ['<2.0.0', [['<2.0.0-0']]],
    ['<2.0.0', [['<2.0.0-0']]],
    ['>= 1.0.0', [['>=1.0.0']]],
    ['>=  1.0.0', [['>=1.0.0']]],
    ['>=   1.0.0', [['>=1.0.0']]],
    ['> 1.0.0', [['>1.0.0']]],
    ['>  1.0.0', [['>1.0.0']]],
    ['<=   2.0.0', [['<=2.0.0']]],
    ['<= 2.0.0', [['<=2.0.0']]],
    ['<=  2.0.0', [['<=2.0.0']]],
    ['<    2.0.0', [['<2.0.0-0']]],
    ['<\t2.0.0', [['<2.0.0-0']]],
    ['>=0.1.97', [['>=0.1.97']]],
    ['>=0.1.97', [['>=0.1.97']]],
    ['0.1.20 || 1.2.4', [['0.1.20'], ['1.2.4']]],
    ['>=0.2.3 || <0.0.1', [['>=0.2.3'], ['<0.0.1-0']]],
    ['>=0.2.3 || <0.0.1', [['>=0.2.3'], ['<0.0.1-0']]],
    ['>=0.2.3 || <0.0.1', [['>=0.2.3'], ['<0.0.1-0']]],
    ['||', [[''], ['']]],
    ['2.x.x', [['>=2.0.0-0', '<3.0.0-0']]],
    ['1.2.x', [['>=1.2.0-0', '<1.3.0-0']]],
    ['1.2.x || 2.x', [['>=1.2.0-0', '<1.3.0-0'], ['>=2.0.0-0', '<3.0.0-0']]],
    ['1.2.x || 2.x', [['>=1.2.0-0', '<1.3.0-0'], ['>=2.0.0-0', '<3.0.0-0']]],
    ['x', [['']]],
    ['2.*.*', [['>=2.0.0-0', '<3.0.0-0']]],
    ['1.2.*', [['>=1.2.0-0', '<1.3.0-0']]],
    ['1.2.* || 2.*', [['>=1.2.0-0', '<1.3.0-0'], ['>=2.0.0-0', '<3.0.0-0']]],
    ['1.2.* || 2.*', [['>=1.2.0-0', '<1.3.0-0'], ['>=2.0.0-0', '<3.0.0-0']]],
    ['*', [['']]],
    ['2', [['>=2.0.0-0', '<3.0.0-0']]],
    ['2.3', [['>=2.3.0-0', '<2.4.0-0']]],
    ['~2.4', [['>=2.4.0-0', '<2.5.0-0']]],
    ['~2.4', [['>=2.4.0-0', '<2.5.0-0']]],
    ['~>3.2.1', [['>=3.2.1-0', '<3.3.0-0']]],
    ['~1', [['>=1.0.0-0', '<2.0.0-0']]],
    ['~>1', [['>=1.0.0-0', '<2.0.0-0']]],
    ['~> 1', [['>=1.0.0-0', '<2.0.0-0']]],
    ['~1.0', [['>=1.0.0-0', '<1.1.0-0']]],
    ['~ 1.0', [['>=1.0.0-0', '<1.1.0-0']]],
    ['~ 1.0.3', [['>=1.0.3-0', '<1.1.0-0']]],
    ['~> 1.0.3', [['>=1.0.3-0', '<1.1.0-0']]],
    ['<1', [['<1.0.0-0']]],
    ['< 1', [['<1.0.0-0']]],
    ['>=1', [['>=1.0.0-0']]],
    ['>= 1', [['>=1.0.0-0']]],
    ['<1.2', [['<1.2.0-0']]],
    ['< 1.2', [['<1.2.0-0']]],
    ['1', [['>=1.0.0-0', '<2.0.0-0']]],
    ['1 2', [['>=1.0.0-0', '<2.0.0-0', '>=2.0.0-0', '<3.0.0-0']]],
    ['1.2 - 3.4.5', [['>=1.2.0-0', '<=3.4.5']]],
    ['1.2.3 - 3.4', [['>=1.2.3', '<3.5.0-0']]]
  ].forEach(function(v) {
    var pre = v[0];
    var wanted = v[1];
    var found = toComparators(v[0]);
    var jw = JSON.stringify(wanted);
    t.equivalent(found, wanted, 'toComparators(' + pre + ') === ' + jw);
  });

  t.end();
});

test('\nstrict vs loose version numbers', function(t) {
  [['=1.2.3', '1.2.3'],
    ['01.02.03', '1.2.3'],
    ['1.2.3-beta.01', '1.2.3-beta.1'],
    ['   =1.2.3', '1.2.3'],
    ['1.2.3foo', '1.2.3-foo']
  ].forEach(function(v) {
    var loose = v[0];
    var strict = v[1];
    t.throws(function() {
      new SemVer(loose);
    });
    var lv = new SemVer(loose, true);
    t.equal(lv.version, strict);
    t.ok(eq(loose, strict, true));
    t.throws(function() {
      eq(loose, strict);
    });
    t.throws(function() {
      new SemVer(strict).compare(loose);
    });
  });
  t.end();
});

test('\nstrict vs loose ranges', function(t) {
  [['>=01.02.03', '>=1.2.3'],
    ['~1.02.03beta', '>=1.2.3-beta <1.3.0-0']
  ].forEach(function(v) {
    var loose = v[0];
    var comps = v[1];
    t.throws(function() {
      new Range(loose);
    });
    t.equal(new Range(loose, true).range, comps);
  });
  t.end();
});

test('\nmax satisfying', function(t) {
  [[['1.2.3', '1.2.4'], '1.2', '1.2.4'],
    [['1.2.4', '1.2.3'], '1.2', '1.2.4'],
    [['1.2.3','1.2.4','1.2.5','1.2.6'], '~1.2.3', '1.2.6'],
    [['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2', '2.0.0b3', '2.0.0', '2.1.0'], '~2.0.0', '2.0.0', true]
  ].forEach(function(v) {
    var versions = v[0];
    var range = v[1];
    var expect = v[2];
    var loose = v[3];
    var actual = semver.maxSatisfying(versions, range, loose);
    t.equal(actual, expect);
  });
  t.end();
});
