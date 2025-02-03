// Connection between Back Node and DB mongodb Atlas.
//usr: a24bermirpre
//pwd: 12345
//Path: mongodb+srv://a24bermirpre:12345@cluster0.a4m9k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


const mongoose = require('mongoose');

const mongoPath = 'mongodb+srv://a24bermirpre:12345@cluster0.a4m9k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 

const connectDB = async () => {
    try {
        console.log("Trying to connect to MongoDB...");
        await mongoose.connect(mongoPath, {
        
        });
        console.log('MongoDB successfully connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
};

connectDB();  

