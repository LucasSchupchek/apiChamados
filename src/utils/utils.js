const jwt = require('jsonwebtoken');


function ajustarData(data) {
    const dataAtual = new Date(data);
    dataAtual.setHours(dataAtual.getHours() - 3);
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
    return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

function obterDataAtualFormatada() {
    const dataAtual = new Date();

    // Subtrai três horas
    dataAtual.setHours(dataAtual.getHours());

    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');

    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

function formatarData(data) {
    if (!data) return ''; // Retorna uma string vazia se a data for null
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    const segundos = String(dataObj.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

function tokenDecoded(req){
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.SEGREDO_JWT);
    
    return decoded
}

module.exports = {
    ajustarData,
    obterDataAtualFormatada,
    tokenDecoded,
    formatarData
}