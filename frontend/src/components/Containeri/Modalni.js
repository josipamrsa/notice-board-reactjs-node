//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from 'react';
import Modal from 'react-modal';
import * as Icon from 'react-feather';

// potrebno postaviti za screen reader
// screen readeri - potrebno je sakriti ono što je iza elementa koji se isčitava
// ReactModal izaziva probleme kod testiranja, pa je zato ovakav setup 
if (process.env.NODE_ENV !== 'test')
  Modal.setAppElement('#root');
else
  Modal.setAppElement(document.createElement('div'));

//----Stil----//
const modalStil = {
  overlay: {
    backgroundColor: "var(--modal-overlay)"
  },
  content: {
    backgroundColor: "var(--modal-background)",
    borderRadius: 10,
    border: "none",
    boxShadow: "0 0 2px var(--modal-study-group-header)",
    backdropFilter: "blur(3px)"
  }
}

const Modalni = (props) => {
  //----Stanja----//
  
  const otvoren = props.otvori;       // Otvaranje modalnog prozora

  //----Metode----//

  // Zatvaranje modalnog prozora
  const zatvoriModalni = () => {
    props.zatvori(false);
  }

  return (
    <Modal
      style={modalStil}
      isOpen={otvoren}
      onRequestClose={zatvoriModalni}
      contentLabel={props.oznaka}>

      <button
        className="modal-zatvori"
        onClick={zatvoriModalni}>
        <Icon.XCircle size={30} />
      </button>
      
      {props.children}
    </Modal>
  );
};

export default Modalni;