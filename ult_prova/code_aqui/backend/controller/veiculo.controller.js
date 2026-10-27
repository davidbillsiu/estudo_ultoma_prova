const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.modelo || !valores.marca || !valores.placa || !valores.idCliente) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
        const cliente = await Cliente.findByPk(valores.idCliente)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente informado não existe!' })
        }

        const novoVeiculo = await Veiculo.create(valores)
        return res.status(201).json({ message: 'Veículo cadastrada com sucesso!', Veiculo: novoVeiculo })
    } catch (err) {
        console.error('Erro ao cadastrar Veículo:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar veículo!' })
    }
}

module.exports = { cadastrar }