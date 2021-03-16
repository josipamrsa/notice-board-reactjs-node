//----KONFIGURACIJA----//
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//----POMOĆNE METODE----//

// Provjera ispravnosti email adrese
const emailProvjera = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

// Schema korisnika
const korisnikSchema = new mongoose.Schema({
    // za prijavu
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [emailProvjera, 'E-mail adresa treba biti oblika prvi@drugi.domena']
    },

    passHash: {
        type: String,
        minlength: 6,
        required: true
    },

    // osnovni podaci
    ime: {
        type: String,
        minlength: 3,
        required: true,
    },

    prezime:  {
        type: String,
        minlength: 3,
        required: true,
    },

    razina:  {
        type: String,
        required: true,
    },

    // pretplate i kanali kojima je vlasnik
    pretplate: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poruka'
        }
    ],

    vlasnistvo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kanali'
        }
    ]
});

// Provjeri jedinstvene vrijednosti
korisnikSchema.plugin(uniqueValidator);

// Override metode koja vraća podatke
korisnikSchema.set('toJSON', {
    transform: (doc, ret) => {
        // transformacija ID-a u tip string
        ret.id = ret._id.toString();

        // vrijednosti koje ne želim vraćati
        delete ret._id;
        delete ret.__v;
        delete ret.passHash;

        return ret;
    }
});

// Stvaranje modela za kolekciju u bazi podataka
const Korisnik = mongoose.model('Korisnik', korisnikSchema, 'korisnici');
module.exports = Korisnik;