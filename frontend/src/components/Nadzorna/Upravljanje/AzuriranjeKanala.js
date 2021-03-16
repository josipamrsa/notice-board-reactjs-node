//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useState } from 'react';

//----Komponente----//
import KanalForma from './KanalForma'; // Prikaz forme za unos podataka o kanalu

//----Servisi----//
import kanalServis from '../../../services/dostupniKanali';

const AzuriranjeKanala = (props) => {
    //----Stanja----//
    const [punoIme, postaviPunoIme] = useState(props.kanal.ime);                // Ime kanala       
    const [kratkoIme, postaviKratkoIme] = useState(props.kanal.kratkoIme);      // Kratko ime kanala ("šifra")
    const [tipKolegija, postaviTipKolegija] = useState(props.kanal.tipKanala);  // Tip kanala (vježbe, predavanja)
    const [grupe, postaviGrupe] = useState(props.grupe);                        // Sve studijske grupe
    const [oznaceneGrupe, postaviOznaceneGrupe] = useState(props.kanal.grupe);  // Grupe koje su označene za odabrani kanal

    const korisnik = props.korisnik;                                            // Info o prijavljenom korisniku

    //----Metode----//

    // Za ažuriranje podataka u bazi
    const izmjenaKanala = (e) => {
        e.preventDefault();

        const azuriraniKanal = {
            ime: punoIme,
            kratkoIme: kratkoIme,
            tipKanala: tipKolegija,
            id: korisnik.id,
            grupe: oznaceneGrupe
        }

        kanalServis.azurirajKanal(props.kanal.id, azuriraniKanal)
            .then((response) => {
                let azuriraniPopis = props.vlasnicki
                    .filter(vl => vl.id !== props.kanal.id);

                props.postaviVlasnicke(azuriraniPopis.concat(response.data));
                alert("Ažuriran kanal!");
            }).catch((err) => {
                alert(err.data.error ||
                    `${err.data.greska} (${err.data.detaljno})`
                );
            });
    }

    return (
        <div className="modal-azuriraj">
            <KanalForma
                dugme="Spremi promjene"
                radnja={izmjenaKanala}
                puno={punoIme}
                kratko={kratkoIme}
                tip={tipKolegija}
                grupe={grupe}
                oznaceneGrupe={oznaceneGrupe}
                postaviPunoIme={postaviPunoIme}
                postaviKratkoIme={postaviKratkoIme}
                postaviTipKolegija={postaviTipKolegija}
                postaviGrupe={postaviGrupe}
                postaviOznaceneGrupe={postaviOznaceneGrupe}
            />
        </div>
    );
}

export default AzuriranjeKanala;