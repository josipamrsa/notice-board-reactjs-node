//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useState } from "react";
import * as Icon from 'react-feather'; 

const UpravljanjeKanalom = (props) => {
    //----Stanja----//
    const [pretplatnici, postaviPretplatnike] = useState(
        props.kanalInfo.pretplate.filter(ka =>
            props.korisnik !== ka.id));                 // Prijenos liste pretplatnika sa glavnog chat-kanala (bez onoga tko je trenutno prijavljen)

    const razina = props.razina;                        // Razina korisnika
    const vlasnik = props.kanalInfo.vlasnik.id;         // Tko je vlasnik kanala (za mogućnost brisanja korisnika)
    const korisnik = props.korisnik;                    // ID korisnika
    const token = props.token;                          // Token korisnika (iako nije trebalo onda slati ID jer se token može raspakirati)

    const mozeBrisati =
        (vlasnik === korisnik) && (razina !== "student"); // Ako je vlasnik i ako njegova razina nije student korisnik može brisati druge s kanala

    //----Metode----//

    // Miče pretplatnika s kanala
    const izbaciKorisnika = (id, kanal, vlasnik, token) => {
        let k = { kanal: kanal.id, vlasnik }

        props.chatServis.izbaciKorisnikaSKanala(id, k, token)
            .then((response) => {
                postaviPretplatnike(pretplatnici
                    .filter(p => p.id !== id));
                props.izbaciKorisnika(kanal.id, id, kanal.ime, kanal.kratkoIme);
                alert("Korisnik uklonjen s kanala.")
            }).catch((err) => {
                alert(err.data.error ||
                    `${err.data.greska} (${err.data.detaljno})`);
            });
    }

    return (
        <div className="modal-kanal-wrapper">
            <h2>Detalji kanala {props.kanalInfo.ime}</h2>

            <div className="modal-kanal-info">
                
                <div className="osnovni-info">
                    <h4>Osnovne informacije </h4>
                    <ul>
                        <li><b>Vlasnik kanala:</b> {props.kanalInfo.vlasnik.ime} {props.kanalInfo.vlasnik.prezime} ({props.kanalInfo.vlasnik.email})</li>
                        <li><b>Tip kanala:</b> {props.kanalInfo.tipKanala} ({props.kanalInfo.tip})</li>
                    </ul>
                </div>

                <div className="studijske-grupe">
                    <h4>Povezane studijske grupe </h4>
                    <ul>
                        {props.kanalInfo.grupe.map(g =>
                            <li key={g.id}>
                                {g.smjer} - {g.godina}. godina ({g.razina})
                            </li>
                        )}
                    </ul>
                </div>

                <div className="info-pretplatnici">
                    <h4>Pretplatnici kanala</h4>
                    <ul>
                        {pretplatnici.map(p =>
                            <li key={p.id}>
                                {p.ime} {p.prezime} ({p.email})
                                    {mozeBrisati &&
                                    <button onClick={() => izbaciKorisnika(p.id, props.kanalInfo, props.korisnik, token)}>
                                        <Icon.UserMinus size={20} /> Izbaci
                                    </button>
                                }
                            </li>
                        )}
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default UpravljanjeKanalom;