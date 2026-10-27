const Cliente = require('../models/Cliente')

const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res) =>{
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.endereco || !valores.telefone){
        return res.status(404).json({message:'preencha todos os campos'})
    }

    if(valores.cpf.length !== 11){
        return res.status(400).json({message:'CPF inválido'})
    }
    try{

        
        const cpfCriptografado = cryptoJs.AES.encrypt(valores.cpf,CHAVE_SECRETA).toString()
        const senhaCriptografada = cryptoJs.AES.encrypt(valores.senha,CHAVE_SECRETA).toString()
        
        await Cliente.create({
            nome:valores.nome,
            email:valores.email,
            senha:senhaCriptografada,
            cpf:cpfCriptografado,
            endereco:valores.endereco,
            telefone:valores.telefone
        })
        
        return res.status(200).json({message:'Dados cadastrados com sucesso'})
        
    }catch(err){
        return res.status(500).json({message:'Não foi possível cadastrar'})
        console.log('Não foi possível cadastrar ',err)
    }
}

const listar = async(req,res)=>{
    try{
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach((el)=>{
            let cpfCriptografado = ''
            try{
                const bytes = cryptoJs.AES.decrypt(el.cpf,CHAVE_SECRETA)
                const cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)
            }catch(err){
                cpfCriptografado = 'erro ao descriptografar'
                console.error(cpfCriptografado, err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome:el.nome,
                email:el.email,
                cpf:cpfCriptografado,
                endereco:el.endereco,
                telefone: el.telefone
            })
        })
        return res.status(200).json(resultado)
    }catch(err){
        console.error('Erro ao listar Clientes: ',err)
        return res.status(500).json({message:'Não foi possível listar os dados'})
    }
}

const consultar = async(req,res) =>{
    const id = req.params.id
    try{
        const cliente = await Cliente.findByPk(id)
        if(!cliente){
            return res.status(404).json({message:'id não encontrado'})
        }
        const bytes = cryptoJs.AES.decrypt(cliente.cpf,CHAVE_SECRETA)
        console.log('bytes = ',bytes)
        const cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)

        return res.status(200).json({
            codCliente:cliente.codCliente,
            nome:cliente.nome,
            email:cliente.email,
            cpf:cliente.cpf,
            endereco:cliente.endereco,
            telefone:cliente.telefone
        })
    }catch(err){
        return res.status(500).json({message:'Não foi possível buscar'})
    }
}

const atualizar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body

    try{
        const cliente = await Cliente.findByPk(id)
        if(!cliente){
            return res.status(404).json({message:'Código não encontrado'})
        }

        const dadosAtualizados = {...valores}
        
        if(valores.cpf){
            if(valores.cpf.length !== 11){
                return res.status(400).json({message:'O cpf deve ter 11 dígitos'})
            }
            dadosAtualizados.cpf = cryptoJs.AES.encrypt(valores.cpf,CHAVE_SECRETA).toString()
        }
        if(valores.senha){
            dadosAtualizados.senha = cryptoJs.AES.encrypt(valores.senha,CHAVE_SECRETA).toString()
        }

        await Cliente.update(dadosAtualizados,{where:{codCliente:id}})
        return res.status(200).json({message:'Cliente atualizado com sucesso!'})
    }catch(err){
        console.error('erro ao atualizar ',err)
        return res.status(500).json({message:'Erro ao atualizar Cliente'})
    }
}

const apagar = async(req,res)=>{
    const id = req.params.id
    try{
        const cliente = await Cliente.findByPk(id)
        if(!cliente){
            return res.status(404).json({message:'Não foi possível encontrar o id'})
        }

        await Cliente.destroy({where:{codCliente:id}})
        return res.status(200).json({message:'Dados excluídos com sucesso'})
    }catch(err){
        return res.status(500).json({message:'Não foi possível apagar'})
    }
}

const consultarPorNome = async(req,res)=>{
    const nome = req.params.nome

    try{
        const cliente = await Cliente.findOne({where:{nome:nome}})

        if(!cliente){
            return res.status(404).json({message:'Não foi possível buscar por nome'})
        }

        const bytes = cryptoJs.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)

        return res.status(200).json({
            codCliente:cliente.codCliente,
            nome:cliente.nome,
            email:cliente.email,
            senha:cliente.senha,
            cpf:cpfDescriptografado,
            endereco:cliente.endereco,
            telefone:cliente.telefone
        })
    }catch(err){
        console.error('erro ao buscar pelo nome')
        return res.status(500).json({message:'Erro ao consultar cliente por nome!'})
    }
}

module.exports = {cadastrar, listar, consultar, atualizar, apagar, consultarPorNome}