const Agendamento = require('../models/Agendamento')
const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.data || !valores.hora || !valores.tipo || !valores.idVeiculo || !valores.idCliente){
        return res.status(404).json({message:'preencha todos os dados'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message:'id cliente inexistente'})
        }
        const veiculo = await Veiculo.findByPk(valores.idVeiculo)
        if(!veiculo){
            return res.status(404).json({message:'id Veiculo inexistente'})
        }
        const novoAgendamento = await Agendamento.create(valores)
        return res.status(201).json({message:'Dados cadastrados com sucesso'})
    }catch(err){
        return res.status(500).json({message:'Não foi possível cadastrar'})
    }
}

const listarAgenda = async(req,res)=>{
    try{
        const agendamentos = await Agendamento.findAll({
            order:[['data','ASC']],
            include
        })
    }
}