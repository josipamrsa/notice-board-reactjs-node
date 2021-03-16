//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useState } from 'react';

//----Komponente----//
import KanalForma from './KanalForma';

//----Servisi----//
import kanalServis from '../../../services/dostupniKanali';

const DodavanjeKanala = (props) => {
    //----Stanja----//

    const [punoIme, postaviPunoIme] = useState("");             // Ime kanala       
    const [kratkoIme, postaviKratkoIme] = useState("");         // Kratko ime kanala ("šifra")
    const [tipKolegija, postaviTipKolegija] = useState("");     // Tip kanala (vježbe, predavanja)
    const [grupe, postaviGrupe] = useState(props.grupe);        // Sve studijske grupe
    const [oznaceneGrupe, postaviOznaceneGrupe] = useState([]); // Grupe koje su označene za odabrani kanal

    const korisnik = props.korisnik;                            // Prijavljeni korisnik
    const razina = props.razina;                                // Razina korisnika (nastavnik ili student)

    //----Metode----//

    // Pomoćna metoda za maknuti odabire na checboxevima/radiobuttonima
    const odznaciCheckboxeve = (inputi) => {
        inputi.forEach((cvor) => {
            if (cvor.checked) {
                cvor.checked = false;
            }
        });
    }

    // Za unos novog kanala
    const unosKanala = (e) => {
        e.preventDefault();

        const noviKanal = {
            ime: punoIme,
            kratkoIme: kratkoIme,
            tipKanala: tipKolegija,
            id: korisnik.id,
            grupe: oznaceneGrupe
        }

        kanalServis.stvoriNoviKanal(noviKanal)
            .then((response) => {
                console.log(response);
                alert("Dodan novi kanal!");

                // očisti sve
                postaviPunoIme("");
                postaviKratkoIme("");
                postaviTipKolegija("");
                postaviOznaceneGrupe("");

                let tipovi = document.forms[0].querySelectorAll('input[name="tip-kolegija"]');
                let grupe = document.forms[0].querySelectorAll('input[name="studijska-grupa"]');

                odznaciCheckboxeve(tipovi);
                odznaciCheckboxeve(grupe);

            }).catch((err) => { 
                //console.log(err); 
                alert(err.data.error || 
                    `${err.data.greska} (${err.data.detaljno})`
                );
            });
    }

    return (
        <div className="modal-dodaj">
            { razina === "student" ?
                <p className="p-upozorenje">Nemate pravo pristupa ovoj komponenti.</p> :
                <KanalForma
                    dugme="Spremi kao novi kanal"
                    radnja={unosKanala}
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
                />}
        </div>
    );
}

export default DodavanjeKanala;