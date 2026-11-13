#!/usr/bin/env node
/* Builds the published, password-locked copy of Minute Book.

   Usage:  MB_PASSWORD='the password' node _src/minute-book/build.js
   Output: /minute-book/index.html, book.css, book.lock.js

   The game's scripts are joined and encrypted with AES-256-GCM. The key is derived from the
   password with PBKDF2-SHA256. The password is never written to disk. The salt is reused from an
   existing build so that devices which chose "keep it open" stay open after a content update;
   pass --new-salt, or change the password, to close them all. */
'use strict';
var crypto = require('crypto'), fs = require('fs'), path = require('path');

var ITER = 250000;
var src = __dirname, out = path.join(__dirname, '..', '..', 'minute-book');
var pw = process.env.MB_PASSWORD;
if (!pw) { console.error('Set MB_PASSWORD to the password.'); process.exit(1); }

var content = fs.readdirSync(path.join(src, 'js', 'content')).filter(function (f) { return /^level\d+\.js$/.test(f); }).sort();
var files = ['js/engine.js', 'js/numerics.js'].concat(content.map(function (f) { return 'js/content/' + f; }));
var code = files.map(function (f) { return fs.readFileSync(path.join(src, f), 'utf8'); }).join('\n;\n') + '\n;MB.start();\n';

fs.mkdirSync(out, { recursive: true });
var lockPath = path.join(out, 'book.lock.js'), salt = null;
if (process.argv.indexOf('--new-salt') === -1 && fs.existsSync(lockPath)) {
  var m = /"salt":"([^"]+)"/.exec(fs.readFileSync(lockPath, 'utf8'));
  if (m) salt = Buffer.from(m[1], 'base64');
}
if (!salt) salt = crypto.randomBytes(16);
var iv = crypto.randomBytes(12);
var key = crypto.pbkdf2Sync(pw, salt, ITER, 32, 'sha256');
var cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
var data = Buffer.concat([cipher.update(code, 'utf8'), cipher.final(), cipher.getAuthTag()]);

var lock = { v: 1, iter: ITER, salt: salt.toString('base64'), iv: iv.toString('base64'), data: data.toString('base64') };
fs.writeFileSync(lockPath, 'window.MB_LOCK=' + JSON.stringify(lock) + ';\n');
fs.copyFileSync(path.join(src, 'css', 'book.css'), path.join(out, 'book.css'));
fs.copyFileSync(path.join(src, 'shell.html'), path.join(out, 'index.html'));
console.log('Built ' + path.relative(process.cwd(), out) + ' from ' + files.length + ' scripts (' + code.length + ' characters, locked).');
