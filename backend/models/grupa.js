//----KONFIGURACIJA----//
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schema grupe
const grupaSchema = new mongoose.Schema({
   smjer: String, 
   godina: Number,
   razina: String, // je li diplomski ili preddiplomski
   kratkiNaziv: String // za oznake kod pregleda kanala (smjer)
});

// Provjeri jedinstvene vrijednosti
grupaSchema.plugin(uniqueValidator);

// Override metode koja vraća podatke
grupaSchema.set('toJSON', {
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
const Grupa = mongoose.model('Grupa', grupaSchema, 'grupe');
module.exports = Grupa;