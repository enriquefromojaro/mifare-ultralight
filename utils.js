Card.prototype.writeFile = function(fileNum, data){
    var command = new ByteString('FF D6 00 00',HEX).add(fileNum).concat(new ByteString('00', HEX).add(data.length)).concat(data);
    this.plainApdu(command);
    return {status: this.getStatus()};
}

Card.prototype.getStatus = function() {
    return this.SW.toString(16);
}

Card.prototype.readFile = function(file, length){
    var resp = this.sendApdu(0xFF, 0xB0, 0x00, file, length);
    return {
	data: resp,
	status: this.getStatus()
    };
}

Card.prototype.getSerialNumber = function(){
    var resp = this.sendApdu(0xFF, 0xCA, 0, 0, 7);
    return {
	data: resp,
	status: this.getStatus()
    };
}

Utils = {
    numbers : {},
    bytes : {}
};

Utils.numbers.fixedLengthIntString = function(num, length) {
    return ("00000000000000000" + num).slice(-1 * length);
}
