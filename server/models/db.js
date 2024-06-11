const mongoose = require('mongoose');

const uri = "mongodb+srv://hilmar:flameo24@peerplatform.mqsqf4i.mongodb.net/?retryWrites=true&w=majority&appName=PeerPlatform";

const connect = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Could not connect to MongoDB", e);
    }
}

module.exports = connect;
