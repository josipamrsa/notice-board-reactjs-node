//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from "react";
import * as Icon from 'react-feather';

const ChatPoruke = (props) => {
    //----Stanja----//

    const DATE_OPTIONS = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }                               // Opcije za datum

    const poruke = props.poruke;    // Dohvaćene poruke

    //----Metode----//

    // Uspoređiva i postavlja novi datum - preko kojeg će se filtrirati samo
    // poruke poslane na taj datum
    const usporediDatume = (poruka, filter) => {
        if (filter) {
            let noviDatum = new Date(poruka).setHours(0, 0, 0, 0);
            let noviFilter = new Date(filter).setHours(0, 0, 0, 0);
            return noviDatum === noviFilter;
        }

        else {
            return true;
        }
    }

    return (
        <div className="chat-form-poruke">
            { poruke.length === 0 ?
                <div>Trenutno nema poruka na kanalu.</div> :
                <ul>
                    {/* enumerator */}
                    {poruke
                        .filter(p => usporediDatume(p.datum, props.filter))
                        .map((poruka, i) => {
                            // JSON uvijek vraća string bez obzira što ja tupim da je Date 
                            let datumPoruke = new Date(poruka.datum);
                            return <li key={i}>
                                <div className={poruka.obavijesna ? "poruka-obavijest-sadrzaj" : "poruka-sadrzaj"}>
                                    <div className="poruka-korisnik-info">
                                        <div>
                                            {poruka.obavijesna && <Icon.Bell size={18} />}
                                        </div>

                                        <div>
                                            {`${poruka.autor.ime} 
                                        (${datumPoruke.toLocaleDateString('hr-HR', DATE_OPTIONS)})`}
                                        </div>
                                    </div>

                                    <span>
                                        {poruka.sadrzaj}
                                    </span>
                                </div>
                            </li>
                        })}
                </ul>
            }
        </div>
    );
}

export default ChatPoruke;