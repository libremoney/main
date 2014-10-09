LibreMoney
==========

LibreMoney project

<http://libremoney.org/>


Install
-------

Updates are available how (Ubuntu)

	sudo apt-get install nodejs npm mongodb
	git clone https://github.com/libremoney/main.git libremoney
	cd libremoney
	npm install
	node web

Install as Service

	sudo npm -g install forever
	forever start web.js

After that, go to your browser: http://localhost:1400/
