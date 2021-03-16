//----KONFIGURACIJA----//

const grupeRouter = require('express').Router();
const Grupa = require('../models/grupa');

//----METODE----//

// Dohvat studijskih grupa
grupeRouter.get('/', async (req, res) => {
    const grupe = await Grupa.find({});
    res.json(grupe);
});

// Dodavanje novih studijskih grupa (Bulk/Pomoćna funkcija)
// Možda administratorska funkcija?
grupeRouter.post('/', async (req, res) => {
    const sadrzaj = req.body;

    sadrzaj.forEach(async s => {
        const grupa = new Grupa({
            smjer: s.smjer,
            godina: s.godina,
            razina: s.razina,
            kratkiNaziv: s.kratkiNaziv,
        });

        const spremljenaGrupa = await grupa.save();
        res.json(spremljenaGrupa);
    });
});

module.exports = grupeRouter;