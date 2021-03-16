const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const pomocne = require('./pomocne');

const Kanal = require('../models/kanal');
const Korisnik = require('../models/korisnik');

// Simulacija API-ja
const api = supertest(app);

beforeEach(async () => {
    pomocne.generiraniKorisnici = await pomocne.postaviKorisnike();
    const { nastavnik, student } = pomocne.generiraniKorisnici;

    const kanal = {
        ime: "Kanal za ažuriranje",
        kratkoIme: "KZA",
        tipKanala: "Vježbe",
        vlasnik: nastavnik._id,
        grupe: [],
        pretplate: [nastavnik._id, student._id],
        poruke: []
    }

    pomocne.generiraniKanal = await pomocne.postaviKanal(kanal);
});

describe('Upravljanje kanalima', () => {
    test('korisnik razine nastavnik moze stvoriti novi kanal', async () => {
        const { nastavnik } = pomocne.generiraniKorisnici;

        const noviKanal = {
            ime: "Novi kanal",
            kratkoIme: "NK",
            tipKanala: "Predavanja",
            id: nastavnik._id,
            grupe: [],
        };

        const odgovor = await api
            .post('/api/kanali')
            .send(noviKanal)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik razine nastavnik moze azurirati podatke kanala', async () => {
        const { nastavnik } = pomocne.generiraniKorisnici;
        const kanalZaAzuriranje = await Kanal.findOne({ kratkoIme: "KZA" });

        const noviPodaci = {
            id: nastavnik._id,
            ime: "Azurirani kanal",
            kratkoIme: "KZA",
            tipKanala: "Predavanja",
            grupe: [],
        };

        const odgovor = await api
            .put(`/api/kanali/update/${kanalZaAzuriranje._id}`)
            .send(noviPodaci)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik razine nastavnik moze obrisati kanal', async () => {
        const kanalZaBrisanje = await Kanal.findOne({ kratkoIme: "KZA" });

        const odgovor = await api
            .delete(`/api/kanali/${kanalZaBrisanje._id}`)
            .send({ idKorisnika: kanalZaBrisanje.vlasnik })
            .expect(204);
    });

    test('korisnik razine student ne moze stvoriti novi kanal', async () => {
        const { student } = pomocne.generiraniKorisnici;

        const noviKanal = {
            ime: "Novi kanal",
            kratkoIme: "NK",
            tipKanala: "Predavanja",
            id: student._id,
            grupe: [],
        };

        const odgovor = await api
            .post('/api/kanali')
            .send(noviKanal)
            .expect(405)
            .expect('Content-Type', /application\/json/);
    });
});

describe('Stvaranje kanala - validacija podataka', () => {
    test('kratko ime kanala mora biti jedinstveno', async () => {
        const { nastavnik } = pomocne.generiraniKorisnici;

        const noviKanal = {
            ime: "Novi kanal",
            kratkoIme: "KZA",
            tipKanala: "Predavanja",
            id: nastavnik._id,
            grupe: [],
        };

        const odgovor = await api
            .post('/api/kanali')
            .send(noviKanal)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const greska = JSON.parse(odgovor.res.text);
        expect(greska.ime).toEqual("ValidationError");
    });
});

describe('Upravljanje pretplatama', () => {
    test('svi kanali se mogu dohvatiti', async () => {
        const odgovor = await api
            .get('/api/kanali')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik moze dohvatiti vlasnicke kanale', async () => {
        const nastavnik = await Korisnik.findOne({ email: "nastavnik@mail.hr" });

        const odgovor = await api
            .get(`/api/kanali/${nastavnik.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('ako korisnik nema vlasnickih kanala, javlja se greska da kanali nisu pronadjeni', async () => {
        const student = await Korisnik.findOne({ email: "student@mail.hr" });

        const odgovor = await api
            .get(`/api/kanali/${student.id}`)
            .expect(404)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik se moze pretplatiti na kanal', async () => {
        const kanalZaAzuriranje = await Kanal.findOne({ kratkoIme: "KZA" });
        const student = await Korisnik.findOne({ email: "student@mail.hr" });

        const odgovor = await api
            .put(`/api/kanali/${kanalZaAzuriranje._id}`)
            .send({ id: student.id, ukloni: false })
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik moze maknuti pretplatu na kanal', async () => {
        const kanalZaAzuriranje = await Kanal.findOne({ kratkoIme: "KZA" });
        const student = await Korisnik.findOne({ email: "student@mail.hr" });

        const odgovor = await api
            .put(`/api/kanali/${kanalZaAzuriranje._id}`)
            .send({ id: student.id, ukloni: true })
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik ne moze maknuti pretplatu na vlastiti kanal', async () => {
        const kanalZaAzuriranje = await Kanal.findOne({ kratkoIme: "KZA" });

        const odgovor = await api
            .put(`/api/kanali/${kanalZaAzuriranje._id}`)
            .send({ id: kanalZaAzuriranje.vlasnik, ukloni: true })
            .expect(405)
            .expect('Content-Type', /application\/json/);
    });
});

afterAll(() => {
    mongoose.connection.close();
});

