require('dotenv').config({ path: 'variaveis.env' });

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*', // Permitir solicitações da origem do cliente
        methods: ['GET', 'POST'], // Permitir métodos HTTP permitidos
        allowedHeaders: ['my-custom-header'], // Permitir cabeçalhos personalizados
        credentials: true // Permitir credenciais (cookies, cabeçalhos de autenticação) a serem enviados
    }
});

const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const routes = require('./routes');
const messageService = require('./services/chatService');

// Configurando multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve('uploads'));
    },
    filename: (req, file, callback) => {
        const time = new Date().getTime();
        callback(null, `${time}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.any());

app.use('/api', routes);

server.listen(process.env.PORT, () => {
    console.log(`Server Running in PORT ${process.env.PORT}`);
});

//####################SOCKET####################//

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('set_username', (username) => {
        socket.data.username = username;
        console.log(socket.data.username);
    });

    socket.on('message', async (data) => {
        console.log(data);

        const messageData = {
            text: data.text,
            author_id: socket.id,
            user_id: data.userAppId,
            chatId: data.chatId,
            path_anexo: data.path_anexo || null
        };

        try {
            const savedMessage = await messageService.saveMessage(messageData);
            console.log(savedMessage)
            io.emit('receive_message', {
                text: savedMessage.descricao,
                author_id: socket.id,
                author: socket.data.username,
                user_id: savedMessage.user_id,
                chatId: savedMessage['chatId'],
                text: savedMessage.text,
                timestamp: savedMessage.data_inclusao
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('get_chat_history', async (chatId) => {
        try {
            const messages = await messageService.getMessagesByChatId(chatId);
            console.log('historico chat ' + JSON.stringify(messages))
            socket.emit('chat_history', messages);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    });
});
