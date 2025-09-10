const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(
            "connection established",
            connect.connection.host,
            connect.connection.name
        );
        
    } catch (error) {
        console.log(error);
        process.exit(1);
        
    }
}

module.exports = connectDb;