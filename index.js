// Import required modules
import { config } from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

// Load environment variables from .env file
config();

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection URL
const URI =process.env.MONGO_URL;
const MONGO_URL = process.env.MONGO_URL;///mentors_students

// assigning DBname
let DBname="mentors_students";

// Define MongoDB schema and models
const mentorSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
});

const Mentor = mongoose.model('Mentor', mentorSchema);
const Student = mongoose.model('Student', studentSchema);

// Connect to MongoDB
mongoose.connect(`${MONGO_URL}/${DBname}`)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// API endpoints

// Create Mentor API
app.post("/mentors", async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json(mentor);
  } catch (error) {
    console.error("Error creating mentor:", error);
    res.status(500).json({ error: "Err or creating mentor" });
  }
});

app.get("/mentors", async (req, res) => {
    try {
      // Fetch all mentors from the database
      const mentors = await Mentor.find();
      
      // Send the mentors data in the response
      res.status(200).json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ error: "Error fetching mentors" });
    }
  });
// Create Student API
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Error creating student" });
  }
});
app.get("/students", async (req, res) => {
    try {
      // Fetch all mentors from the database
      const students = await Student.find();
      
      // Send the mentors data in the response
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ error: "Error fetching mentors" });
    }
  });
// Assign Student to Mentor API
app.post("/mentors/:mentorId/students/:studentId/assign", async (req, res) => {
  try {
    const { mentorId, studentId } = req.params;
    const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId }, { new: true });
    res.json(student);
  } catch (error) {
    console.error("Error assigning student to mentor:", error);
    res.status(500).json({ error: "Error assigning student to mentor" });
  }
});

// Assign Multiple Students to a Mentor API
app.post("/mentors/:mentorId/students/assign-multiple", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { studentIds } = req.body;
    const students = await Student.updateMany({ _id: { $in: studentIds } }, { mentor: mentorId });
    res.json(students); 
  } catch (error) {
    console.error("Error assigning multiple students to mentor:", error);
    res.status(500).json({ error: "Error assigning multiple students to mentor" });
  }
});

// Assign or Change Mentor for a Student API
app.put("/students/:studentId/assign-mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;
    const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId }, { new: true });
    res.json(student);
  } catch (error) {
    console.error("Error assigning or changing mentor for student:", error);
    res.status(500).json({ error: "Error assigning or changing mentor for student" });
  }
});

// Show all Students for a particular Mentor API
app.get("/mentors/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students for mentor:", error);
    res.status(500).json({ error: "Error fetching students for mentor" });
  }
});

// Show Previously Assigned Mentor for a Student API
app.get("/students/:studentId/previous-mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('mentor');
    res.json(student.mentor);
  } catch (error) {
    console.error("Error fetching previous mentor for student:", error);
    res.status(500).json({ error: "Error fetching previous mentor for student" });
  }
});

// Start the server
const PORT = process.env.Port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
