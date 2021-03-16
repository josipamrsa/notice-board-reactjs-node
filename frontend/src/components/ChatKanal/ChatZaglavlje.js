//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from "react";

const ChatZaglavlje = (props) => {
    return (
        <div className="chat-zaglavlje">
            {props.children}
        </div>
    );
}

export default ChatZaglavlje;