//----KONFIGURACIJA----//
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schema poruke
const porukaSchema = new mongoose.Schema({
    // je li obavijest ili obična poruka (mozda radije bool?)
    obavijesna: {
        type: Boolean,
        default: false
    },

    sadrzaj: {
        type: String,
        minlength: 1,
        required: true
    },
    
    datum: Date,

    // autor poruke i kojem chat kanalu pripada
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnik'
    },

    chatKanal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kanal'
    },

    // za citiranje korisnika
    // odgovor: {}
});

// Provjeri jedinstvene vrijednosti
porukaSchema.plugin(uniqueValidator);

// Override metode koja vraća podatke
porukaSchema.set('toJSON', {
    transform: (doc, ret) => {
        // transformacija ID-a u tip string
        ret.id = ret._id.toString();

        // vrijednosti koje ne želim vraćati
        delete ret._id;
        delete ret.__v;

        return ret;
    }
});

// Stvaranje modela za kolekciju u bazi podataka
const Poruka = mongoose.model('Poruka', porukaSchema, 'poruke');
module.exports = Poruka;