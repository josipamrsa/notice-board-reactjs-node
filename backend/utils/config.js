//----KONFIGURACIJA----//
require('dotenv').config();

// Jedine konstante u mom životu

//----PORT----//
const PORT = process.env.PORT;

//----BAZA PODATAKA----//
const password = process.env.ATLAS_PASS;
const username = process.env.ATLAS_USER;

const dbname = process.env.NODE_ENV === 'test'
? 'ob-ploca-test'
: 'ob-ploca-api';

const DB_URI = `mongodb+srv://${username}:${password}@obavijesnaplocacluster.p31wx.mongodb.net/${dbname}?retryWrites=true&w=majority`;
module.exports = {PORT, DB_URI};

