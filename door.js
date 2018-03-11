load('utils.js');

var MASTER_KEY = new ByteString('0A1A2A3A4A5A6A7A8B9BABBBCBDBEBFB', HEX);

var card = new Card();
try{
    var accessGranted =  card.readFile(4, 4);
    if(resp.status === '9000')
	accessGranted = accessGranted.data;
    else
	throw '[ERROR] Error when reading access: ' + resp.status;
    if(accessGranted.toString(ASCII) !== '11SI')
	throw 'This ticket has been already used!!! Access denied!!';
    
    // These fields should be retrieved from a server or other external source and not from the card
    var event = 'EE01';
    var date = '1203';
    var year = '2018';
    var vendor = 'VD01';
    
    // These fields must be read from the card. Maybe more validation over them would be nice
    var seat =  card.readFile(6, 4);
    if(resp.status === '9000')
	seat = seat.data;
    else
	throw '[ERROR] Error when reading seat: ' + resp.status;
    
    if(! seat.right(2).equals(seat.left(2)))
	throw 'Seat has been modified!! Access denied!!';
    
    var grandstand =  card.readFile(8, 4);
    if(resp.status === '9000')
	grandstand = grandstand.data;
    else
	throw '[ERROR] Error when reading grandstand: ' + resp.status;

    // We calc the mac and assert that it matches with the one in the card
    var cardKey = card.getCardKey(MASTER_KEY);
    var macChain = access + event + seat.toString(ASCII) + vendor + grandstand.toString(ASCII) + year + date;
    var mac = card.calcMAC(new ByteString(macChain, ASCII), cardKey);
    
    var cardMAC =  card.readFile(0x0B, 4);
    if(resp.status === '9000')
	cardMAC = cardMAC.data;
    else
	throw '[ERROR] Error when reading card MAC: ' + resp.status;
    if(!cardMAC.equals(mac))
	throw 'card MAC does not match!!! Access denied!!';
    // Now we know the ticket is valid. Now we set it as used
    access = '00NO';
    var resp = card.writeFile(4, new ByteString(access, ASCII));
    if(resp.status !== '9000')
	throw '[ERROR] Error writing access: ' + resp.status;
    
    
    macChain = access + event + seat.toString(ASCII) + vendor + grandstand.toString(ASCII) + year + date;
    mac = card.calcMAC(new ByteString(macChain, ASCII), cardKey);
    resp = card.writeFile(0x0B, mac);
    if(resp.status !== '9000')
	throw '[ERROR] Error writing MAC: ' + resp.status;
    print('Access granted!! Enjoy!!');
}catch(err){
    print(err);
}
finally{
    for(var i=0; i<0x0C; i++) print(card.readFile(i, 4).data);
    card.close()
}