//----KONFIGURACIJA----//
import React from 'react';
import 'react-feather';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

//----Komponente----//
import NadzornaForma from './NadzornaForma';

describe('Renderiranje nadzorne ploce', () => {
    let npKomponenta;

    beforeEach(() => {
        const odjava = jest.fn();
        const korisnik = {
            ime: "Test",
            email: "test@test.hr",
            token: "token"
        }

        npKomponenta = render(
            <NadzornaForma korisnik={korisnik} odjava={odjava} />
        );
    });

    test('nadzorna ploca se renderira', () => {
        expect(npKomponenta.container).toBeDefined();
    });

    test('moguce je uci u postavke na nadzornoj ploci', () => {
        const dugmePostavke = npKomponenta.container.querySelector('.btn-postavke');
        fireEvent.click(dugmePostavke);
       
        const modal = document.querySelector('.ReactModal__Body--open');

        expect(modal).toBeDefined();
        expect(modal).toHaveTextContent("Dodaj novi kanal");
    });
});


