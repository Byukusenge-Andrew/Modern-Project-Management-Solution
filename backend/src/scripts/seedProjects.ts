import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { connectDB } from '../config/database';

dotenv.config();

const seedProjects = async () => {
  try {
    await connectDB();

    // Find a user to associate with the projects
    const user = await User.findOne();
    if (!user) {
      console.error('No users found in the database. Please create a user first.');
      process.exit(1);
    }

    // Sample projects
    const projects = [
      {
        name: 'Project Alpha',
        description: 'This is the first sample project.',
        isPublic: true,
        owner: user._id,
        members: [user._id],
      },
      {
        name: 'Project Beta',
        description: 'This is the second sample project.',
        isPublic: false,
        owner: user._id,
        members: [user._id],
      },
    ];

    // Insert sample projects into the database
    await Project.insertMany(projects);
    console.log('Sample projects added successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects(); 