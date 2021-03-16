//----KONFIGURACIJA----//
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schema kanala
const kanalSchema = new mongoose.Schema({
    ime: {
        type: String,
        minlength: 5,
        required: true
    },

    // jer će biti šifra za kanal
    kratkoIme: {
        type: String,
        minlength: 1,
        unique: true, 
        required: true
    },

    tipKanala: {
        type: String,
        required: true
    }, // jesu li vježbe, predavanja, itd.
    
    // vlasnik kanala
    vlasnik: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Korisnik'
    },

    // kojim grupama pripada kanal
    grupe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupa'
    }],

    // tko su pretplatnici na kanal
    pretplate: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnik'
    }],

    // lista poruka vezana za kanal
    poruke: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poruka'
    }]
});

// Provjeri jedinstvene vrijednosti
kanalSchema.plugin(uniqueValidator);

// Override metode koja vraća podatke
kanalSchema.set('toJSON', {
    transform: (doc, ret) => {
        // transformacija ID-a u tip string
        ret.id = ret._id.toString();
        ret.tip = ret.tipKanala[0]; // za oznaku pri pregledu

        // vrijednosti koje ne želim vraćati
        delete ret._id;
        delete ret.__v;

        return ret;
    }
});

// Stvaranje modela za kolekciju u bazi podataka
const Kanal = mongoose.model('Kanal', kanalSchema, 'kanali');
module.exports = Kanal;