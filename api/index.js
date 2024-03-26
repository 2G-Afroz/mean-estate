import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

dotenv.config();

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
}

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.use("/user", userRouter);
app.use("/auth", authRouter);