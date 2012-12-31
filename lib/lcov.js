
/**
 * Expose `LCovFile`.
 */

exports = module.exports = LCovFile;

var fs = require('fs'),
    filePath = process.env.MOCHA_LCOV_REPORTER_FILE || process.cwd() + "/coverage.lcov",
    fd = fs.openSync(filePath, 'w', 0644);

/**
 * Initialize a new LCOV reporter.
 * File format of LCOV can be found here: http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php
 * The reporter is built after this parser: https://raw.github.com/SonarCommunity/sonar-javascript/master/sonar-javascript-plugin/src/main/java/org/sonar/plugins/javascript/coverage/LCOVParser.java
 *
 * @param {Runner} runner
 * @api public
 */

function LCovFile(runner) {
  runner.on('end', function(){
    var cov = global._$jscoverage || {};

    for (var filename in cov) {
      var data = cov[filename];
      reportFile(filename, data);
    }
  });
}

function reportFile(filename, data) {
  fs.writeSync(fd, 'SF:' + filename + '\n', null, 'utf8');

  data.source.forEach(function(line, num) {
    // increase the line number, as JS arrays are zero-based
    num++;

    if (data[num] !== undefined) {
      fs.writeSync(fd, 'DA:' + num + ',' + data[num] + '\n', null, 'utf8');
    }
  });

  fs.writeSync(fd, 'end_of_record\n');
}
