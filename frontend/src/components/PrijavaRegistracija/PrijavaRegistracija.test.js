//----KONFIGURACIJA----//
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

//----Komponente----//
import PrijavaRegistracijaForma from './PrijavaRegistracijaForma';

describe('Renderiranje stranice za prijavu/registraciju', () => {
    let prKomponenta;

    beforeEach(() => {        
        prKomponenta = render(
            <PrijavaRegistracijaForma
                korisnik={{}}
                korisnikUlogiran={() => { }} />
        );
    });

    test('stranica za prijavu i registraciju inicijalizirana je na prijavu', () => {
        expect(prKomponenta.container).toHaveTextContent('Prijava u sustav');
        expect(prKomponenta.container.querySelector('.forma-prijava')).toBeDefined();
    });

    test('klikom na dugme promjene modula se modul prebaciva sa prijave na registraciju', () => {
        const modulDugme = prKomponenta.container.querySelector('.dugme-modul');
        fireEvent.click(modulDugme);

        expect(prKomponenta.container).toHaveTextContent('Registracija u sustav'); // Prebacio se na registracijsku formu
        expect(modulDugme).toHaveTextContent('Prijava');                           // Dugme modula iducim klikom prebaciva na formu prijave
        expect(prKomponenta.container.querySelector('.forma-registracija')).toBeDefined(); // Prikazana je forma registracije
    });

    test('ponovnim klikom na dugme promjene modula se prikaz vraca na prijavu', () => {
        const modulDugme = prKomponenta.container.querySelector('.dugme-modul');
        fireEvent.click(modulDugme);
        fireEvent.click(modulDugme);

        expect(prKomponenta.container).toHaveTextContent('Prijava u sustav'); // Prebacio se na formu prijave
        expect(modulDugme).toHaveTextContent('Registracija');                 // Dugme modula iducim klikom prebaciva na formu registracije
        expect(prKomponenta.container.querySelector('.forma-prijava')).toBeDefined(); // Prikazana je forma prijave
    });
});


