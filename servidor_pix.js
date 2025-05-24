
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'APP_USR-8160430385048854-041513-72cd79fb6cb17c0d71d4196103e0c379-81656546';

app.post('/criar-pagamento', async (req, res) => {
    try {
        const { valor, nome } = req.body;

        const response = await axios.post('https://api.mercadopago.com/v1/payments', {
            transaction_amount: parseFloat(valor),
            description: `Pedido hamburgueria - ${nome}`,
            payment_method_id: 'pix',
            payer: {
                email: 'comprador@mail.com',
                first_name: nome
            }
        }, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const pix = response.data.point_of_interaction.transaction_data;
        res.json({
            qr_code_base64: pix.qr_code_base64,
            qr_code: pix.qr_code,
            ticket_url: response.data.transaction_details.external_resource_url
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao criar pagamento' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
