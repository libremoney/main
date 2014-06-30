/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0 license
 */

// 1. Аргументы командной строки
// 2. Переменные среды
// 3. Наш собственный файл с конфигурацией

var nconf = require('nconf');


nconf.argv()
  .env()
  .file({ file: './conf/main.json' });

module.exports = nconf;
