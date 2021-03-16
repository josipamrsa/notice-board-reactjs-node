//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from 'react';
import * as Icon from 'react-feather';  

const KarticniPrikaz = (props) => {
    return (
        <div className="kartice-modal">
            <button
                onClick={() => props.postaviKarticu(true)}>
                    <Icon.FilePlus /> Dodaj novi kanal
            </button>

            <button
                onClick={() => props.postaviKarticu(false)}>
                    <Icon.Edit />Upravljaj postojećim kanalima
            </button>
        </div>
    );
};

export default KarticniPrikaz;