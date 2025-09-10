const getOrder = (req, res)=>{
    res.send("get page of ORDERSS ")
}

const createOrder = (req, res) => {
    res.send(`create for order pAGE`)
}

const updateOrder = (req, res) => {
    res.send(`update for order ${req.params.id}`)
}

const deleteOrder = (req, res) => {
    res.send(`delete for order ${req.params.id}`)
}

module.exports = {getOrder, updateOrder, deleteOrder, createOrder};