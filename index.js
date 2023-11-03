import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import postRoute from './routes/post.js'
import passport from 'passport';
import './config/passport.js';
import expressSession from 'express-session';

const app = express()



dotenv.config()

app.use(cors({
    origin: ['http://localhost:5173', 'https://media-book-frontend.vercel.app'],
    methods: 'GET, POST, DELETE, PUT',
    credentials: true,
 }));

app.use(express.json())

app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true, cookie: { secure: true } }));
app.use(passport.initialize());
app.use(passport.session());


const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGODB);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };
  
  mongoose.set('debug', true);
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });
  

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/post', postRoute)




app.get( '/', (req, res)=>{
 res.send('this is root route')
})





app.listen(5000, () => {
    connect();
    console.log('Backend is connected');
  });
  