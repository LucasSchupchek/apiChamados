const chatService = require('../services/chatService');
const path = require('path');
const fs = require('fs');
const s3Service = require('../config/s3Storage');
const { tokenDecoded } = require('../utils/utils');

async function getChatMessages(req, res) {
    try {
        const userId = tokenDecoded(req).userId;
        const chatId = req.query.chatId;
        const page = req.query.page || 1; // Página atual (padrão: 1)
        const limit = req.query.limit || 20; // Limite de itens por página (padrão: 20)

        const messages = await chatService.getChatMessages(chatId, page, limit);

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    getChatMessages
}