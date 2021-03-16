//----IMPORTI----//
import bg1 from '../../res/bg1.png';

//----TEME----//
const pmf = {
    // Boje za scrollbar
    "--scrollbar-track-color": "#006ba1",
    "--scrollbar-thumb-color": "linear-gradient(#007cba, #d3e7f1, #d3e7f1, white)",
    "--scrollbar-thumb-inverse-color": "linear-gradient(white, #d3e7f1, #d3e7f1, #007cba)",

    // Pozadinska slika
    "--background": "linear-gradient(#007cba, #d3e7f1, #d3e7f1, white)",

    // Login komponenta
    "--login-wrapper": "#005a87",
    "--login-input-color": "#d3e7f1",
    "--login-button-color": "#007cba",
    "--login-other-button-color": "#006ba1",
    "--login-text-color": "white",
    "--login-heading-color": "white",
    "--login-input-text": "#005a87",
    "--login-button-text": "white",
    "--login-placeholder-text": "#006ba1",
    "--login-shadow-color": "darkblue",

    // Nadzorna ploča
    "--dash-header-color": "#003651",
    "--dash-item-li-color": "#6CB3D6",
    "--dash-item-container": "#E3F6FF",
    "--dash-select-item-color": "#007CBA",
    "--dash-text-item-color": "white",
    "--dash-header-text-color": "#E3F6FF",
    "--dash-second-header-text-color": "white",
    "--dash-second-text-color": "#E3F6FF",
    "--dash-shadow-color": "#007CBA",
    "--dash-second-shadow-color": "#27A2E0",
    "--dash-link-hover-color": "#005A87",
    "--dash-button-color": "#007CBA",
    "--dash-second-button-color": "#E3F6FF",
    "--dash-button-hover-color": "#005A87",

    // Modalni prozor
    "--modal-background": "rgba(108, 179, 214, 0.6)",
    "--modal-overlay": "rgba(108, 179, 214, 0.2)",
    "--modal-content-background": "#e7f1f6", 
    "--modal-input-shadow": "#748c99",
    "--modal-text-shadow": "#4b8cac",
    "--modal-button-color": "#007CBA",
    "--modal-second-button-color": "#003651",
    "--modal-study-group-header": "#4b8cac",
    "--modal-study-group-selections": "#78b8d9",
    "--modal-study-group-second-selections": "#afccdb",
    "--modal-header-text-color": "white",
    "--modal-second-header-text-color": "#007CBA",
    "--modal-third-button-color": "#4b8cac",
    "--modal-third-header-text-color": "#003651",
    "--modal-study-group-text": "#335f74",
    "--modal-type-text": "#003651",
    "--modal-shadow-elements": "#426cb6",
    "--modal-second-header-color": "#003651",

    // Chat komponenta
    "--chat-header-color": "#003651",
    "--chat-header-text-color": "#E3F6FF",
    "--chat-header-button": "#E3F6FF",
    "--chat-form-shadow": "#003651",
    "--chat-form-background": "rgba(0, 124, 186, 0.2)",
    "--chat-message-shadow": "#5daad1",
    "--chat-message-color": "#d3e7f1",
    "--chat-message-text-color": "#003651",
    "--chat-message-info-color": "#003651",
    "--chat-message-info-text-color": "white",
    "--chat-notify-message-color": "#43aee7",
    "--chat-notify-text-color": "white",
    "--chat-notify-shadow-text-color": "#5daad1",
    "--chat-notify-info-color": "#1e8ac4",
    "--chat-notify-info-text-color": "white",
    "--chat-button-color": "#1e8ac4",
    "--chat-button-shadow": "#0e4d6e",
    "--chat-notify-bell-color": "#0097e7",
}

const skolska = {
    // Boje za scrollbar
    "--scrollbar-track-color": "#4D2F2C",
    "--scrollbar-thumb-color": "linear-gradient(#4D2F2C, #7D5F4D, #7D5F4D, wheat)",
    "--scrollbar-thumb-inverse-color": "linear-gradient(wheat, #7D5F4D, #7D5F4D, #4D2F2C)",

    // Pozadinska slika
    "--background": `url(${bg1})`,

    // Login komponenta
    "--login-wrapper": "#4D2F2C",
    "--login-input-color": "#FFF4EB",
    "--login-button-color": "#7D5F4D",
    "--login-other-button-color": "#583E36",
    "--login-text-color": "wheat",
    "--login-heading-color": "wheat",
    "--login-input-text": "#583E36",
    "--login-button-text": "wheat",
    "--login-placeholder-text": "#9A7565",
    "--login-shadow-color": "#7D5F4D",

    // Nadzorna ploča
    "--dash-header-color": "#4D2F2C",
    "--dash-item-li-color": "#B69C79",
    "--dash-item-container": "#FFF3E3",
    "--dash-select-item-color": "#7D5F4D",
    "--dash-text-item-color": "#FFF3E3",
    "--dash-header-text-color": "#F2D4BA",
    "--dash-second-header-text-color": "#FFF3E3",
    "--dash-second-text-color": "#F2D4BA",
    "--dash-shadow-color": "#7D5F4D",
    "--dash-second-shadow-color": "#987A68",
    "--dash-link-hover-color": "#4D2F2C",
    "--dash-button-color": "#7D5F4D",
    "--dash-second-button-color": "#FFF3E3",
    "--dash-button-hover-color": "#4D2F2C",

    // Modalni prozor
    "--modal-background": "rgba(157, 132, 97, 0.6)",
    "--modal-overlay": "rgba(167, 128, 107, 0.3)",
    "--modal-content-background": "#FFF3E3", 
    "--modal-input-shadow": "#cab18e",
    "--modal-text-shadow": "#7c6b53",
    "--modal-button-color": "#4D2F2C",
    "--modal-second-button-color": "#4D2F2C",
    "--modal-study-group-header": "#7c6b53",
    "--modal-study-group-selections": "#c6b296",
    "--modal-study-group-second-selections": "#e7d3b7",
    "--modal-header-text-color": "white",
    "--modal-second-header-text-color": "#B69C79",
    "--modal-third-button-color": "#9d8461",
    "--modal-third-header-text-color": "#4D2F2C",
    "--modal-study-group-text": "#4D2F2C",
    "--modal-type-text": "#4D2F2C",
    "--modal-shadow-elements": "#5d4c2d",
    "--modal-second-header-color": "#4D2F2C",

    // Chat komponenta
    "--chat-header-color": "#4D2F2C",
    "--chat-header-text-color": "wheat",
    "--chat-header-button": "wheat",
    "--chat-form-shadow": "#4D2F2C",
    "--chat-form-background": "rgba(125, 95, 77, 0.8)",
    "--chat-message-shadow": "#765b4a",
    "--chat-message-color": "#e7cb95",
    "--chat-message-text-color": "#34201e",
    "--chat-message-info-color": "#4D2F2C",
    "--chat-message-info-text-color": "wheat",
    "--chat-notify-message-color": "#e5b356",
    "--chat-notify-text-color": "white",
    "--chat-notify-shadow-text-color": "#7c6b53",
    "--chat-notify-info-color": "#b48836",
    "--chat-notify-info-text-color": "wheat",
    "--chat-button-color": "#4D2F2C",
    "--chat-button-shadow": "#76524e",
    "--chat-notify-bell-color": "#ffdc9c",
}

export default { pmf, skolska }