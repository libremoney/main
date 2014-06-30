var path = require('path');

module.exports = function (mongoose) {
	// Объявляем схему для Mongoose
	var Schema = new mongoose.Schema({
		name: { type: String, required: true }
	});

	// Инициализируем модель с именем файла, в котором она находится
	return mongoose.model(path.basename(module.filename, '.js'), Schema);
};
