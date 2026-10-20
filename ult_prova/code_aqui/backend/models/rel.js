const Veiculo = require('./Veiculo')
const Cliente = require('./Cliente')
const Agendamento = require('./Agendamento')

Veiculo.hasMany(Agendamento,{
    foreignKey:'idVeiculo',
    as:'agendamentoVeiculo',
    onDelete:'CASCADE'
})

Agendamento.belongsTo(Veiculo,{
    foreignKey:'idVeiculo',
    as:'veiculoAgendamento',
    allowNull:false
})

Cliente.hasMany(Agendamento,{
    oreignKey:'idCliente',
    as:'agendamentoCliente',
    onDelete:'CASCADE'
})

Agendamento.belongsTo(Cliente,{
    oreignKey:'idCliente',
    as:'clienteAgendamento',
    allowNull:false
})

Cliente.hasMany(Veiculo,{
    foreignKey:'idCliente',
    as:'veiculoCliente',
    onDelete:'CASCADE'
})

Veiculo.belongsTo(Cliente,{
    oreignKey:'idCliente',
    as:'clienteVeiculo',
    allowNull:false
})

module.exports = {Veiculo, Cliente, Agendamento }