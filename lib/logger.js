var winston = require('winston');

/*
module.exports = function (module) {
	return function (msg) {
		console.log('Lm: ' + msg); //console.log(module.id + ' ' + msg);
	}
}
*/


function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/');
    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path
            })
        ]
    });
}

module.exports = getLogger;
