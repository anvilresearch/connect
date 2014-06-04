/**
 * Dependencies
 */

var cluster = require('cluster')
  , os = require('os')
  ;


/**
 * Fork the process for the number of CPUs available
 */

if (cluster.isMaster) {
  var cpus = os.cpus().length;
  console.log('Starting %s workers', cpus);
  for (var i = 0; i < cpus; i += 1) {
    cluster.fork();
  }
}


/**
 * Start the server in a worker
 */

else {
  require('anvil-connect').start();
}


/**
 * Replace dead workers
 */

cluster.on('exit', function (worker) {
  cluster.fork();
});
