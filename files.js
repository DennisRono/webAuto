var LogWriter = require('log-writer');
var writer = new LogWriter(__dirname+'/Logs/log-file-name-%s.log');
writer.write('write\r\n');
writer.writeln('writeln');
writer.end();