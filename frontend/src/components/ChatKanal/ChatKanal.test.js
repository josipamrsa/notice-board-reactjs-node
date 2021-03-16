//----KONFIGURACIJA----//
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';

//----Komponente----//
import ChatKanalForma from './ChatKanalForma';

describe('Renderiranje chat prozora', () => {
    let chpKomponenta;

    beforeEach(() => {
        chpKomponenta = render(
            <Router>
                <ChatKanalForma match={{ params: { kratkoIme: "/tKan" } }} location={{
                    state: {
                        ime: "Ime",
                        imeKanala: "Test Kanal",
                        idKorisnika: "00",
                        razina: "nastavnik"
                    }
                }} />
            </Router>
        );

        chpKomponenta.debug();
    });

    test('chat kanal se renderira', () => {
        expect(chpKomponenta.container).toBeDefined();
        
        expect(chpKomponenta.container).toHaveTextContent("Test Kanal");
    });

    test('datum se mijenja odabirom nekog datuma u filteru', () => {
        const datumInput = chpKomponenta.container.querySelector('.datum-input');
        fireEvent.change(datumInput, { target: { value: '2021-03-06' } });

        expect(datumInput.value).toBe('2021-03-06');
    });

});


