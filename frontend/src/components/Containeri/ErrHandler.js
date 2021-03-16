//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from 'react';
import * as Icon from 'react-feather';

const ErrHandler = (props) => {
    //----Metode----//

    // Resetira svojstvo greške 
    const ocistiGresku = () => {
        props.postaviGresku("");
    }
    
    return (
        <div>
            {
                props.greska &&
                    <div className="err-handler-container">
                        {props.greska}
                        <button onClick={ocistiGresku}>
                            <Icon.XCircle size={28} />
                        </button>
                    </div>
            }
        </div>
    );
}

export default ErrHandler;