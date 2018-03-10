load('utils.js');

var MASTER_KEY = new ByteString('0A1A2A3A4A5A6A7A8B9BABBBCBDBEBFB', HEX);

var card = new Card();
// writting access
var access = '11SI';
var resp = card.writeFile(4, new ByteString(access, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing acces to the event: ' + resp.status);
    exit;
}

// Writing Event
var event = 'EE01'
resp = card.writeFile(5, new ByteString(event, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing event code: ' + resp.status);
    exit();
}
//Writing Seat
var seatNum = 31;
var seatString = seatNum.toString();
resp = card.writeFile(6, new ByteString(seatString + seatString, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing seat: ' + resp.status);
    exit();
}
//Writing Vendor
var vendor = 'VD01';
resp = card.writeFile(7, new ByteString(vendor, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing vendor: ' + resp.status);
    exit();
}

// writing grandstand
var grandstand = 25;
grandStand = Utils.numbers.fixedLengthIntString(grandstand, 4)
resp = card.writeFile(8, new ByteString(grandStand, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing grandstand: ' + resp.status);
    exit();
}

// writting year
var year = 2018;
year = Utils.numbers.fixedLengthIntString(year, 4)
resp = card.writeFile(9, new ByteString(year, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing year: ' + resp.status);
    exit();
}

//writing date
var date = '1203';
resp = card.writeFile(0x0A, new ByteString(date, ASCII));
if(resp.status !== '9000'){
    print('[ERROR] Error when writing date: ' + resp.status);
    exit();
}

//writing MAC
var cardKey = card.getCardKey(MASTER_KEY);
var macChain = access + seatString + seatString + vendor + grandstand + year + date;
var mac = card.calcMAC(new ByteString(macChain, ASCII), cardKey);

resp = card.writeFile(0x0B, mac);
if(resp.status !== '9000'){
    print('[ERROR] Error when writing MAC: ' + resp.status);
    exit;
}

