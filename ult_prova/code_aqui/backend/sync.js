const conn = require('./db/conn')
const {Veiculo, Cliente, Agendamento} = require('./models/rel')

async function syncDataBase() {
    try{
        await conn.sync({force:true})
        console.log('banco rodando')
    }catch(err){
        console.log('Erro ao sincronizar', err)
    }finally{
         conn.close()
        console.log('Fechando o banco')
    }
}

syncDataBase()