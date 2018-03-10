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

Utils.bytes.encryptAES_ECB = function(plain, cypherKey){
    var zeros = (16 - (plain.length % 16)) % 16;

    var plaincpy = plain;
    for( var i=0; i<zeros; i++){
	plaincpy = plaincpy.concat(new ByteString('00', HEX));
    }

    var crypto = new Crypto();
    var key = new Key();
    key.setComponent(Key.AES, cypherKey);

    var cyphered = crypto.encrypt(key, Crypto.AES_ECB, plaincpy);

    return cyphered;
}

Utils.bytes.encryptAES_CBC = function (plain, cypherKey, iv){
    var zeros = (16 - (plain.length % 16)) % 16;

    var plaincpy = plain;
    for( var i=0; i<zeros; i++){
	plaincpy = plaincpy.concat(new ByteString('00', HEX));
    }

    var crypto = new Crypto();
    var key = new Key();
    key.setComponent(Key.AES, cypherKey);

    var cyphered = crypto.encrypt(key, Crypto.AES_CBC, plaincpy, iv);

    return cyphered;
}
