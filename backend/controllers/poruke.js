//----KONFIGURACIJA----//

const porukeRouter = require('express').Router();
const Poruka = require('../models/poruka');
const Korisnik = require('../models/korisnik');
const Kanal = require('../models/kanal');
const jwt = require('jsonwebtoken');

//----METODE----//

// Dohvat poruka na kanalu
porukeRouter.get('/:id', async (req, res) => {
    const korisnik = await provjeriToken(req, res);

    const idKanala = req.params.id;
    const kanal = await Kanal
        .findById(idKanala)
        .populate('poruke');

    if (!kanal) {
        return res.status(404).json({ error: "Kanal ne postoji!" });
    }

    const prethodnePoruke = await Poruka
        .find({ '_id': { $in: kanal.poruke } })
        .populate('autor', { ime: 1 })
        .sort({ datum: 1 });

    //console.log(prethodnePoruke);
    res.json(prethodnePoruke);
});

// Dohvat punih informacija o kanalu
porukeRouter.get('/kanal/:id', async (req, res) => {
    const korisnik = await provjeriToken(req, res);

    const id = req.params.id;
    const kanal = await Kanal.findById(id)
        .populate('pretplate')
        .populate('grupe')
        .populate('vlasnik');
    res.json(kanal);
});

// Slanje poruka u kanal
porukeRouter.post('/:id', async (req, res) => {
    const idKanala = req.params.id;
    const porukaPodaci = req.body;
    const idKorisnika = porukaPodaci.autor.id;

    const prijavljeni = await provjeriToken(req, res);
    const korisnik = await Korisnik.findById(idKorisnika);

    if (!korisnik) {
        return res.status(404).json({ error: "Korisnik ne postoji!" });
    }

    if (prijavljeni.id.toString() !== korisnik.id.toString()) {
        return res.status(401).json({ error: "Korisnici se ne podudaraju - autorizacija nije uspjela!" });
    }

    const kanal = await Kanal.findById(idKanala);

    if (!kanal) {
        return res.status(404).json({ error: "Kanal ne postoji!" });
    }

    if (!kanal.pretplate.includes(idKorisnika)) {
        return res.status(405).json({ error: "Nemate dozvole za slanje poruka na ovaj kanal!" });
    }

    if (kanal.vlasnik.toString() !== idKorisnika && porukaPodaci.obavijesna) {
        return res.status(405).json({ error: "Nemate dozvole za slanje obavijesnih poruka!" });
    }

    const poruka = new Poruka({
        obavijesna: porukaPodaci.obavijesna || false, // zasad
        sadrzaj: porukaPodaci.sadrzaj,
        datum: Date.parse(porukaPodaci.datum),
        autor: korisnik.id.toString(),
        chatKanal: kanal.id.toString()
    });

    const novaPoruka = await poruka.save();
    kanal.poruke = kanal.poruke.concat(novaPoruka._id);
    const azurKanal = await kanal.save();
    res.json(azurKanal);
});

// Brisanje korisnika s kanala
porukeRouter.delete('/korisnik/:id', async (req, res) => {
    const id = req.params.id;
    const idKanala = req.body.kanal;
    const idVlasnika = req.body.vlasnik;

    const prijavljeni = await provjeriToken(req, res);

    const pretplatnik = await Korisnik.findById(id);
    const vlasnik = await Korisnik.findById(idVlasnika);
    const kanal = await Kanal.findById(idKanala);

    if (prijavljeni.id.toString() !== vlasnik.id.toString()) {
        return res.status(401).json({ error: "Korisnici se ne podudaraju - autorizacija nije uspjela!" });
    }

    if (!pretplatnik || !vlasnik) {
        res.status(404).json({ error: "Korisnik (pretplatnik ili vlasnik) ne postoji!" });
    }

    else if (!kanal) {
        res.status(404).json({ error: "Kanal ne postoji!" });
    }

    else if (kanal.vlasnik.toString() !== idVlasnika.toString()) {
        return res.status(405).json({ error: "Korisnik nema autorizaciju za uklanjanje korisnika s kanala!" });
    }

    else if (!kanal.pretplate.includes(pretplatnik.id)) {
        res.status(405).json({ error: "Nedozvoljeno - korisnik nije pretplatnik kanala!" });
    }

    kanal.pretplate = kanal.pretplate.filter(p => p.toString() !== id);
    await kanal.save();
    pretplatnik.pretplate = pretplatnik.pretplate.filter(k => k.toString() !== idKanala);
    await pretplatnik.save();

    res.status(204).end();
});

// Dohvat tokena iz konfiguracije
const dohvatiToken = req => {
    const auth = req.get('authorization');
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7);
    }
    return null;
}

// Provjera poslanog tokena korisnika
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

module.exports = porukeRouter;