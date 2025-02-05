import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { connectDB } from '../config/database';

dotenv.config();

const seedUser = async () => {
  try {
    await connectDB();

    // Check if a user already exists
    const existingUser = await User.findOne({ email: 'sampleuser@example.com' });
    if (existingUser) {
      console.log('Sample user already exists.');
      process.exit(0);
    }

    // Create a sample user
    const user = new User({
      name: 'Sample User',
      email: 'sampleuser@example.com',
      password: 'hashedpassword', // Ensure this is a hashed password
    });

    await user.save();
    console.log('Sample user added successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser(); 