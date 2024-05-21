const dashboardService = require('../services/dashboardService');

async function chamadosCategorias(req, res) {
    let json = { error: '', result: {} };

    const data_inicial = req.query.data_inicial;
    const data_final = req.query.data_final;

    if (!data_inicial || !data_final) {
        json.error = 'Os parâmetros data_inicial e data_final são obrigatórios.';
        res.status(400).json(json);
        return;
    }

    try {
        const dashboard = await dashboardService.chamadosCategorias(data_inicial, data_final);
        if (dashboard && dashboard.length > 0) {
            json.result = dashboard;
        } else {
            json.result = 'Nenhum dado encontrado para o período especificado.';
        }
        res.json(json);
    } catch (error) {
        json.error = 'Erro ao buscar dados do dashboard';
        res.status(500).json(json);
    }
}

async function chamadosSetor(req, res) {
    let json = { error: '', result: {} };

    const data_inicial = req.query.data_inicial;
    const data_final = req.query.data_final;

    if (!data_inicial || !data_final) {
        json.error = 'Os parâmetros data_inicial e data_final são obrigatórios.';
        res.status(400).json(json);
        return;
    }
    try {
        const dashboard = await dashboardService.chamadosSetor(data_inicial, data_final);
        if (dashboard && dashboard.length > 0) {
            json.result = dashboard;
        } else {
            json.result = 'Nenhum dado encontrado para o período especificado.';
        }
        res.json(json);
    } catch (error) {
        json.error = 'Erro ao buscar dados do dashboard';
        res.status(500).json(json);
    }
}

async function abertosFechados(req, res) {
    let json = { error: '', result: {} };
    try {
        const dashboard = await dashboardService.abertosFechados();
        if (dashboard && dashboard.length > 0) {
            json.result = dashboard;
        }
        res.json(json);
        
    } catch (error) {
        json.error = 'Erro ao buscar dados do dashboard';
        res.status(500).json(json);
    }
}

module.exports = {
    chamadosCategorias,
    chamadosSetor,
    abertosFechados
};
