import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/slotswapper';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    dbName: uri.split('/').pop()
  });
  console.log('MongoDB connected');
};

export default connectDB;


