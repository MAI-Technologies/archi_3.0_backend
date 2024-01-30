require("dotenv").config();
const mongoose = require('mongoose');
mongoose.set({ strictQuery: true });

module.exports = async () => {
    console.log(`Initializing Database Connection`);

    try {
        await mongoose.connect(process.env.DATABASE_URL);
    } catch (err) {
        throw err;
    }
}