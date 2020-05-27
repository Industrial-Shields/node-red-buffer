// See https://nodered.org/docs/creating-nodes/node-js

module.exports = function(RED) {
	function toObject(buff, config) {
		var obj = {};
		config.rules.forEach(function(rule) {
			if (rule.t && rule.n) {
				obj[rule.n] = buff['read' + rule.t](rule.o);
			}
		});
		return obj;
	}

	function toBuffer(obj, config) {
		var buff = Buffer.allocUnsafe(config.len);
		config.rules.forEach(function(rule) {
			if (rule.t && rule.n) {
				buff['write' + rule.t](obj[rule.n], rule.o);
			}
		});

		return buff;
	}

	function BufferEncoder(config) {
		RED.nodes.createNode(this, config);

		this.on("input", msg => {
			if (Buffer.isBuffer(msg.payload)) {
				msg.payload = toObject(msg.payload, config);
			} else if (typeof msg.payload == 'object') {
				msg.payload = toBuffer(msg.payload, config);
			} else {
				return;
			}
			this.send([msg]);
		});

		this.on("close", done => {
			done();
		});
	}

	RED.nodes.registerType("buffer-encoder", BufferEncoder);
}
