var Datastore = require('nedb');

// Of course you can create multiple datastores if you need several
// collections. In this case it's usually a good idea to use autoload for all collections.
db = {};
db.blocks = new Datastore('./database/blocks.db');

// You need to load each database (here we do it asynchronously)
db.blocks.loadDatabase();

// ID(lo tomo de la db)
// PreviousHash(Hash del bloque anterior)
// Nonce/Magic number (numero calculado para que el Hash sea valido)
// Data (objeto serializado en json que contiene toda la data del bloque)
// DataLenght (numero que identifica el largo de la cadena string de data)
// Timestamp
function block(Id, P_Hash, Hash, Nonce, Data, D_Lenght, Timestamp){
    var b = {};
    b.Id = Id;
    b.PHash = P_Hash;
    b.Hash = Hash;
    b.Nonce = Nonce;
    b.Data = Data;
    b.DLength = D_Lenght;
    b.Timestamp = Timestamp;
    return b;
}
function data(){
    var d = {};
    d.Title = 'sarasa';
    d.Title = 'Some random long and good description';
    d.Title = 'tags';
    d.Title = 'magnet link';            
};

console.log(JSON.stringify(block('ub88876FVSD6Vdytasvda5f', '0','fgdfe6s6hse6hs56km5768m8d76876578', '12345', '{PITO,PATO,PUTO}', 10)));