//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';

//----Komponente----//
import AzuriranjeKanala from './AzuriranjeKanala';

//----Servisi----//
import kanalServis from '../../../services/dostupniKanali';

const UpravljanjeKanalima = (props) => {
    //----Stanja----//
    const [vlasnicki, postaviVlasnicke] = useState([]);     // Za izlistavanje vlasničkih kanala
    const [uredi, postaviUredjivanje] = useState(false);    // Ako korisnik želi ažurirati kanal
    const [kanal, postaviKanal] = useState({});             // Koji kanal će se ažurirati (koji je odabran)

    const korisnik = props.korisnik;                        // Prijavljeni korisnik
    const grupe = props.grupe;                              // Studijske grupe
    const razina = props.razina;                            // Razina prijavljenog korisnika

    //----Metode----//

    // Dohvat onih kanala čiji je vlasnik prijavljeni korisnik
    useEffect(() => {
        kanalServis.dohvatiVlastiteKanale(korisnik.id)
            .then((response) => {
                postaviVlasnicke(response.data);
                //console.log(response.data);
            })
            .catch((err) => {
                alert(err.data.error ||
                    `${err.data.greska} (${err.data.detaljno})`
                );
            });
    }, []);

    // Metoda za brisanje odabranog kanala
    const brisanjeKanala = (kanal) => {
        let potvrda = window
            .confirm("Jeste li sigurni da želite obrisati ovaj kanal?");

        if (potvrda) {
            kanalServis.obrisiKanal(kanal.id, korisnik.id)
                .then((response) => {
                    postaviVlasnicke(vlasnicki.filter(vl => vl.id !== kanal.id));
                    alert("Obrisan kanal!");
                }).catch((err) => {
                    alert(err.data.error ||
                        `${err.data.greska} (${err.data.detaljno})`
                    );
                });
        }
    }

    // Otkrivanje/zatvaranje dijaloga za ažuriranje odabranog kanala
    const omoguciAzuriranjeKanala = (kanal) => {
        postaviUredjivanje(true);
        postaviKanal(kanal);
    }

    const zatvoriAzuriranje = () => {
        postaviUredjivanje(false);
    }

    return (
        <div className="modal-upravljaj">
            { razina === "student" ?
                <p className="p-upozorenje">Nemate pravo pristupa ovoj komponenti.</p> :
                <div>
                    {uredi ?
                        <div className="azuriranje-container">
                            <button
                                onClick={zatvoriAzuriranje}
                                className="zatvori-azuriranje">
                                <Icon.X />
                            </button>

                            <AzuriranjeKanala
                                kanal={kanal}
                                grupe={grupe}
                                korisnik={korisnik}
                                vlasnicki={vlasnicki}
                                postaviVlasnicke={postaviVlasnicke}
                            />
                        </div> :
                        <div>
                            <ul>
                                {vlasnicki.map((ka) => (
                                    <li key={ka.kratkoIme}>
                                        <div className="kanal-info-azuriranje">{ka.ime} ({ka.tipKanala})</div>
                                        <div className="upravljanje-kontrole">
                                            <button onClick={() => omoguciAzuriranjeKanala(ka)}>
                                                <Icon.Edit size={20} /> Ažuriraj
                                            </button>
                                            <button onClick={() => brisanjeKanala(ka)}>
                                                <Icon.Trash2 size={20} /> Briši
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>}
                </div>
            }
        </div>
    );
}

export default UpravljanjeKanalima;