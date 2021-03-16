//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from 'react';
import * as Icon from 'react-feather'; 

const KanalForma = (props) => {
    //----Stanja----//

    const oznaceneGrupe = props.oznaceneGrupe;                          // Grupe označene već za odabrani kanal (ako postoje)
    const diplomske = props.grupe.filter(g => g.razina === "D");        // Grupe koje su diplomske razine
    const preddiplomske = props.grupe.filter(g => g.razina === "PD");   // Grupe koje su preddiplomske razine

    //----Metode----//

    // Kontrolirani unos - input element za promjenu punog imena
    const promjenaPuno = (e) => {
        props.postaviPunoIme(e.target.value);
    }

    // Kontrolirani unos - input element za promjenu kratkog imena
    const promjenaKratko = (e) => {
        props.postaviKratkoIme(e.target.value);
    }

    // Kontrolirani unos - radio element za odabir tipa kanala (kolegija)
    const promjenaTip = (oznaceno) => {
        props.postaviTipKolegija(oznaceno.value);
    }

    // Kontrolirani unos - checkbox element za odabir studijskih grupa za kolegij
    const promjenaGrupa = (oznaceno) => {
        if (oznaceno.checked)
            props.postaviOznaceneGrupe([...oznaceneGrupe, oznaceno.value]);
        else
            props.postaviOznaceneGrupe(oznaceneGrupe.filter(g => g !== oznaceno.value));
    }

    return (
        <div className="modal-kanal-forma">
            <form onSubmit={props.radnja}>
                <div className="forma-ime">
                    <input type="text" placeholder="Unesite puno ime kolegija..." onChange={promjenaPuno} value={props.puno} />
                    <input type="text" placeholder="Unesite kratko ime kolegija..." onChange={promjenaKratko} value={props.kratko} />
                </div>

                <div className="forma-tip">
                    <label>
                        <input type="radio"
                            defaultChecked={props.tip === "Predavanja" ? true : false}
                            name="tip-kolegija"
                            value="Predavanja"
                            onChange={({ target }) => promjenaTip(target)} /> Predavanja
                    	</label>

                    <label>
                        <input type="radio"
                            defaultChecked={props.tip === "Vježbe" ? true : false}
                            name="tip-kolegija"
                            value="Vježbe"
                            onChange={({ target }) => promjenaTip(target)} /> Vježbe
                        </label>
                </div>

                <div className="forma-studijske">
                    <div className="naslov">
                        <h3><Icon.Users />Studijske grupe</h3>
                    </div>

                    <div className="diplomski">
                        <h4>Diplomska razina</h4>
                        <ul>
                            {diplomske.map((d) => (
                                <li key={d.id} title={d.smjer}>
                                    <input
                                        defaultChecked={oznaceneGrupe.includes(d.id) ? true : false} // Je li već odabrano
                                        type="checkbox"
                                        name="studijska-grupa"
                                        value={d.id}
                                        onChange={({ target }) => {
                                            promjenaGrupa(target);
                                        }} />
                                    {`${d.kratkiNaziv} (${d.godina}. godina)`}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="preddiplomski">
                        <h4>Preddiplomska razina</h4>
                        <ul>
                            {preddiplomske.map((d) => (
                                <li key={d.id} title={d.smjer}>
                                    <input
                                        defaultChecked={oznaceneGrupe.includes(d.id) ? true : false} // Je li već odabrano
                                        type="checkbox"
                                        name="studijska-grupa"
                                        value={d.id}
                                        onChange={({ target }) => {
                                            promjenaGrupa(target);
                                        }} />
                                    {`${d.kratkiNaziv} (${d.godina}. godina)`}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <button type="submit"><Icon.Save />{props.dugme}</button>
            </form>
        </div>
    );
}

export default KanalForma;