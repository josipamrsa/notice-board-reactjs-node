const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const pomocne = require('./pomocne');

const Korisnik = require('../models/korisnik');

// Simulacija API-ja
const api = supertest(app);

beforeEach(async () => {
    await Korisnik.deleteMany({});
    pomocne.generiraniPrijavljeni = await pomocne.postaviJednogKorisnika();
});

describe('Operacije s korisnicima', () => {
    test('korisnik se moze registrirati', async () => {
        const noviKorisnik = {
            adresa: "lazni@mail.hr",
            lozinka: "laznalozinka",
            ime: "Lažni",
            prezime: "Korisnik",
            razina: "student"
        };

        const odgovor = await api
            .post('/api/korisnici')
            .send(noviKorisnik)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik se moze ulogirati', async () => {
        const korisnik = {
            adresa: "novilazni@mail.hr",
            lozinka: "lazna2"
        }

        const odgovor = await api
            .post('/api/login')
            .send(korisnik)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik se ne moze ulogirati ako nije prisutan u bazi', async () => {
        const korisnik = {
            adresa: "novilazni2@mail.hr",
            lozinka: "lazna3"
        }

        const odgovor = await api
            .post('/api/login')
            .send(korisnik)
            .expect(401);
    });

    test('korisnik se ne moze ulogirati sa pogresnom sifrom', async () => {
        const korisnik = {
            adresa: "novilazni@mail.hr",
            lozinka: "lazna3"
        }

        const odgovor = await api
            .post('/api/login')
            .send(korisnik)
            .expect(401);
    });
});

describe('Provjera tokena', () => {
    test('korisnik sa ispravnim podacima i tokenom se moze ulogirati', async () => {
        const korisnik = {
            adresa: "novilazni@mail.hr",
            lozinka: "lazna2"
        }

        const token = await pomocne.loginKorisnika(korisnik.adresa, korisnik.lozinka);

        const odgovor = await api
            .get('/api/korisnici/verify')
            .set('Authorization', `bearer ${token}`)
            .send(korisnik)
            .expect(200);
    });

    test('korisnik bez vazeceg tokena ne moze se ulogirati', async () => {
        const korisnik = {
            adresa: "novilazni@mail.hr",
            lozinka: "lazna2"
        }

        const token = "000";

        const odgovor = await api
            .get('/api/korisnici/verify')
            .set('Authorization', `bearer ${token}`)
            .send(korisnik)
            .expect(401);
    });
});

describe('Provjera ispravnosti poslanih podataka kod registracije', () => {
    test('korisnik se ne moze registrirati bez podatka o email adresi', async () => {
        const noviKorisnik = {
            adresa: "",
            lozinka: "laznalozinka",
            ime: "Lažni",
            prezime: "Korisnik",
            razina: "student"
        };

        const odgovor = await api
            .post('/api/korisnici')
            .send(noviKorisnik)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        const greska = JSON.parse(odgovor.res.text);
        expect(greska.ime).toEqual("ValidationError");
    });

    test('korisnik se ne moze registrirati sa neispravnim formatom email adrese', async () => {
        const noviKorisnik = {
            adresa: "lazni@mail",
            lozinka: "laznalozinka",
            ime: "Lažni",
            prezime: "Korisnik",
            razina: "student"
        };

        const odgovor = await api
            .post('/api/korisnici')
            .send(noviKorisnik)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        const greska = JSON.parse(odgovor.res.text);
        expect(greska.ime).toEqual("ValidationError");
    });

    test('korisnik se ne moze registrirati sa podatkom o imenu manjim od tri znaka', async () => {
        const noviKorisnik = {
            adresa: "lazni@mail",
            lozinka: "laznalozinka",
            ime: "An",
            prezime: "Korisnik",
            razina: "student"
        };

        const odgovor = await api
            .post('/api/korisnici')
            .send(noviKorisnik)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        const greska = JSON.parse(odgovor.res.text);
        expect(greska.ime).toEqual("ValidationError");
    });

    test('korisnik se ne moze registrirati sa lozinkom manjom od sest znakova', async () => {
        const noviKorisnik = {
            adresa: "lazni@mail",
            lozinka: "lazna",
            ime: "Novi",
            prezime: "Korisnik",
            razina: "student"
        };

        const odgovor = await api
            .post('/api/korisnici')
            .send(noviKorisnik)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        const greska = JSON.parse(odgovor.res.text);
        expect(greska.ime).toEqual("ValidationError");
    });
});

afterAll(() => {
    mongoose.connection.close()
});

