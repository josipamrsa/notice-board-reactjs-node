//----KONFIGURACIJA----//

const kanaliRouter = require('express').Router();
const Kanal = require('../models/kanal');
const Korisnik = require('../models/korisnik');

//----METODE----//

// Dohvat svih kanala
kanaliRouter.get('/', async (req, res) => {
    const kanali = await Kanal.find({})
        .populate('poruke');
    res.json(kanali);
});

// Dodavanje novog kanala
kanaliRouter.post('/', async (req, res) => {
    const sadrzaj = req.body;
    const vlasnik = await Korisnik.findById(sadrzaj.id);

    if (!vlasnik) {
        return res.status(404).json({ error: "Korisnik ne postoji!" });
    }

    if (vlasnik.razina === "student") {
        return res.status(405).json({ error: "Korisnik nema autorizaciju za dodavanje novih kanala." });
    }

    const kanal = new Kanal({
        ime: sadrzaj.ime,
        kratkoIme: sadrzaj.kratkoIme,
        tipKanala: sadrzaj.tipKanala,
        vlasnik: vlasnik.id,
        grupe: sadrzaj.grupe,
        pretplate: [vlasnik.id],
        poruke: []
    });

    const spremljeniKanal = await kanal.save();
    res.json(spremljeniKanal);
});

// Dohvat svih vlasničkih kanala (id - korisnik)
kanaliRouter.get('/:id', async (req, res) => {
    const idKorisnika = req.params.id;

    const korisnik = await Korisnik.findById(idKorisnika);
    if (!korisnik) {
        return res.status(404).json({ error: "Korisnik ne postoji!" });
    }

    const korisnickiKanali = await Kanal.find({ vlasnik: korisnik.id });

    if (korisnickiKanali.length < 1) {
        return res.status(404).json({ error: "Korisnik nema vlastitih kanala!" });
    }

    res.json(korisnickiKanali);
});

// Ažuriranje kanala (id - kanal)
kanaliRouter.put('/update/:id', async (req, res) => {
    const idKanala = req.params.id;
    const azurirani = req.body;

    const korisnik = await Korisnik.findById(azurirani.id);
    const kanal = await Kanal.findById(idKanala);

    if (!korisnik || !kanal) {
        return res.status(404).json({ error: "Korisnik ili kanal ne postoji." });
    }

    else if (korisnik.razina === "student" || kanal.vlasnik.toString() !== korisnik.id.toString()) {
        return res.status(405).json({ error: "Korisnik nema autorizaciju za ažuriranje postojećih kanala." });
    }

    const noviPodaci = {
        ime: azurirani.ime,
        kratkoIme: azurirani.kratkoIme,
        tipKanala: azurirani.tipKanala,
        vlasnik: kanal.vlasnik,
        grupe: azurirani.grupe,
        pretplate: kanal.pretplate
    }

    const azuriraniKanal = await Kanal.findByIdAndUpdate(idKanala, noviPodaci, { new: true });
    res.json(azuriraniKanal);
});

// Brisanje kanala (id - kanal)
kanaliRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const korisnik = await Korisnik.findById(req.body.idKorisnika);
    const kanal = await Kanal.findById(id);

    if (!korisnik) {
        return res.status(404).json({ error: "Korisnik ne postoji!" });
    }

    else if (!kanal) {
        return res.status(404).json({ error: "Kanal ne postoji!" });
    }

    else if (korisnik.razina === "student" || kanal.vlasnik.toString() !== korisnik.id.toString()) {
        return res.status(405).json({ error: "Korisnik nema autorizaciju za brisanje postojećih kanala." });
    }

    await Kanal.findByIdAndRemove(id);
    res.status(204).end();
});

// Uklanjanje/dodavanje pretplate (id - kanal)
kanaliRouter.put('/:id', async (req, res) => {
    const idKanala = req.params.id;
    const idKorisnika = req.body.id;
    const zaUklanjanje = req.body.ukloni;

    const korisnik = await Korisnik.findById(idKorisnika);
    const kanal = await Kanal.findById(idKanala);

    if (!korisnik || !kanal) {
        return res.status(404).json({ error: "Korisnik ili kanal ne postoji." });
    }

    else if (korisnik.id === kanal.vlasnik.toString()) {
        return res.status(405).json({ error: "Korisnik je vlasnik kanala - pretplata se ne može ukloniti." });
    }

    const pretplata = {
        ime: kanal.ime,
        kratkoIme: kanal.kratkoIme,
        tipKanala: kanal.tipKanala,
        vlasnik: kanal.vlasnik,
        grupe: kanal.grupe,
        pretplate: zaUklanjanje ?
            kanal.pretplate.filter((k) => k.toString() !== korisnik.id) :
            kanal.pretplate.concat(korisnik.id)
    }

    const noviPretplatnik = await Kanal.findByIdAndUpdate(idKanala, pretplata, { new: true });
    res.json(noviPretplatnik);
});

// Dohvat tokena iz konfiguracije
const dohvatiToken = req => {
    const auth = req.get('authorization');
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7);
    }
    return null;
}

// Provjera poslanog tokena
const provjeriToken = async (req, res) => {
    const podatak = req.body;
    const token = dohvatiToken(req);
    
    const dekToken = jwt.verify(token, process.env.SECRET);

    if (!token || !dekToken.id) {
        return res.status(401).json({ error: 'Dobiveni token je neispravan ili više ne postoji!' });
    }

    const korisnik = await Korisnik.findById(dekToken.id);
    
    if (!korisnik) {
        return res.status(401).json({ error: 'Nepostojeći korisnik!' });
    }

    return korisnik; 
}

module.exports = kanaliRouter;