const mongoose = require('mongoose');
const mongoURI = process.env.MONGOURI;

const connectDB=async ()=>{
    try {
        await mongoose.connect(mongoURI,{});
        console.log('✅ mongodb connected');
    } catch (error) {
        console.error('❌ mongodb connection failed:', error.message);
        process.exit(1);
    }
}
module.exports=connectDB;