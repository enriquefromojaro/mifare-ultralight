load('utils.js');

var MASTER_KEY = new ByteString('0A1A2A3A4A5A6A7A8B9BABBBCBDBEBFB', HEX);

var card = new Card();
// writting access
var resp = card.writeFile(4, new ByteString('11SI', ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing acces to the event: ' + resp.status);
    exit;
}

// Writing Event
resp = card.writeFile(5, new ByteString('EE01', ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing event code: ' + resp.status);
    exit;
}
//Writing Seat
var seatNum = 31;
var seatString = seatNum.toString();
resp = card.writeFile(6, new ByteString(seatString + seatString, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing seat: ' + resp.status);
    exit;
}
//Writing Vendor
resp = card.writeFile(7, new ByteString('VD01', ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing vendor: ' + resp.status);
    exit;
}

// writing grandstand
var grandstand = 25;
resp = card.writeFile(8, new ByteString(Utils.numbers.fixedLengthIntString(grandstand, 4), ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing grandstand: ' + resp.status);
    exit;
}

// writting year
var year = 2018;
resp = card.writeFile(9, new ByteString(Utils.numbers.fixedLengthIntString(year, 4), ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing year: ' + resp.status);
    exit;
}

//writing date
resp = card.writeFile(0x0A, new ByteString('1203', ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing date: ' + resp.status);
    exit;
}

//writing MAC
resp = card.writeFile(0x0B, new ByteString('1203', ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing MAC: ' + resp.status);
    exit;
}

