const getCustomer = (req, res) =>{
    res.send("you are in the customer page ")
};

const createCustomer = (req, res) =>{
    res.send("you are in the customer create page")
};

const updateCustomer = (req, res) => {
    res.send(`create customer ${req.params.id}`)
}

const deleteCustomer = (req, res) => {
    res.json({
        "message" : `delete customer ${req.params.id}`
    })
}

module.exports = {getCustomer, createCustomer, updateCustomer, deleteCustomer};

