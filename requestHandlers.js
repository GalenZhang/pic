var querystring = require("querystring"),
fs = require("fs"),
//util = require('util'),
formidable = require("formidable");

function start(response, request) {
	console.log("Request handler 'start' was called.");

	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<input type="file" name="upload">'+
	'<input type="submit" value="Upload file" />'+
	'</form>'+
	'</body>'+
	'</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	console.log("about to parse");

	// parse a file upload
	var form = new formidable.IncomingForm();
	form.parse(request, function(err, fields, files) {
		console.log("parsing done");

		//console.log("file path: " + files.upload.path);
		//fs.renameSync(files.upload.path, "./tmp/test.png");

		var readStream = fs.createReadStream(files.upload.path)
		var writeStream = fs.createWriteStream("./tmp/test.png");

		readStream.pipe(writeStream);
		readStream.on('end', function() {
			fs.unlinkSync(files.upload.path);
		});
		/* node.js 0.6 and earlier you can use util.pump:
			util.pump(is, os, function() {
			    fs.unlinkSync('source_file');
			});
		*/

		response.writeHead(200, {'content-type': 'text/html'});
		response.write("received image:<br/>");
		response.write('<img src="/show"/>');
		response.end();
	});
}

function show(response, postData) {
	console.log("Request handler 'show' was called.");
	fs.readFile("./tmp/test.png", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;