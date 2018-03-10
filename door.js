load('utils.js');

var MASTER_KEY = new ByteString('0A1A2A3A4A5A6A7A8B9BABBBCBDBEBFB', HEX);

var card = new Card();
try{
    
}catch(err){
    print(err);
}
finally{
    card.close()
}