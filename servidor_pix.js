import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: '*' }))
app.use(express.json())

const ACCESS_TOKEN = 'APP_USR-8160430385048854-041513-72cd79fb6cb17c0d71d4196103e0c379-81656546'

app.post('/pix', async (req, res) => {
  try {
    const { nome, cpf, valor, descricao } = req.body

    const body = {
      transaction_amount: Number(valor),
      description: descricao || 'Pagamento via QR Code PIX',
      payment_method_id: 'pix',
      payer: {
        email: 'guilhermeinacio_sp@hotmail.com',
        first_name: nome || 'Cliente',
        identification: {
          type: 'CPF',
          number: cpf || '31592231837'
        }
      }
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(500).json({ erro: 'Falha ao gerar pagamento', detalhe: data })
    }

    res.json({
      qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
      qr_code: data.point_of_interaction.transaction_data.qr_code,
      id: data.id
    })

  } catch (err) {
    console.error('Erro geral:', err)
    res.status(500).json({ erro: 'Erro interno no servidor' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
