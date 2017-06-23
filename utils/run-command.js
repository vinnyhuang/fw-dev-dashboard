var spawn = require('child_process').spawn;

function runCommand(command, onStdOutData, onStdErrData, onClose) {
  var splits = command.split(' ');

  var proc = spawn(splits[0], splits.slice(1));

  if (onStdOutData) {
    proc.stdout.on('data', onStdOutData);
  }

  if (onStdErrData) {
    proc.stderr.on('data', onStdErrData);
  }

  if (onClose) {
    proc.on('close', onClose);
  } else {
    proc.on('close', function(error) {
      if (error) {
        throw error;
      }
    });
  }
}

module.exports = runCommand;
