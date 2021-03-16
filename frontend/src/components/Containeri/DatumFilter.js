//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from 'react';
import * as Icon from 'react-feather';

const DatumFilter = (props) => {
    //----Metode----//

    // Postavlja datum za filtriranje
    const promijeniDatum = (e) => {
        props.postaviDatumFilter(new Date(e.target.value));
    }

    // Resetira vrijednost svojstva filtera
    const resetirajFilter = () => {
        props.postaviDatumFilter("");
        // ciscenje inputa preko njegovog selektora
        document.querySelector("input").value = "";
    }

    return (
        <div className="datum-filter">
            <input type="date" className="datum-input" onChange={promijeniDatum} />
            <button 
                onClick={resetirajFilter} 
                className="datum-salji">
                    <Icon.Filter size={20} /> Resetiraj
            </button>
        </div>
    );
}

export default DatumFilter;