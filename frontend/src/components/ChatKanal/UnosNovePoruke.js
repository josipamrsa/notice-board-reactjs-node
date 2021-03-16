//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from "react";
import * as Icon from 'react-feather';

const UnosNovePoruke = (props) => {
    //----Stanja----//

    const razina = props.razina;            // Razina korisnika koji šalje novu poruku
    const korisnik = props.korisnik;        // Id korisnika koji šalje poruku
    const vlasnik = props.vlasnik;          // Tko je vlasnik kanala (za mogućnost slanja obavijesti)

    const mozeObavijestiti = (razina !== "student") && (vlasnik === korisnik);  // Tko može slati obavijest (samo vlasnik)

    return (
        <div className="chat-forma-unos-wrapper">
            <form onSubmit={props.posaljiNovuPoruku} className="chat-forma-unos">

                <div className="obavijest">
                    {mozeObavijestiti &&
                        <label>
                             <span><Icon.Bell size={28} /></span>
                            <input
                                type="checkbox"
                                value={props.obavijesna}
                                onChange={props.postaviObavijesnu} />
                        </label>}
                </div>

                <div className="sadrzaj">
                    <input
                        className="input-sadrzaj"
                        value={props.sadrzajPoruke}
                        onChange={props.promjenaNovaPoruka}
                        placeholder="Napiši poruku..." />
                </div>

                <div className="slanje">
                    <button type="submit"><Icon.Send /></button>
                </div>

            </form>
        </div>
    );
}

export default UnosNovePoruke;