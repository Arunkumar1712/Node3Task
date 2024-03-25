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


// Define the common inline styles
const commonStyles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f0f0;
    }
    .container {
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
      color: #333;
    }
    h4 {
      margin-bottom: 10px;
      color: #666;
    }
    p {
      color: #444;
    }
  </style>
`;

// API endpoints

// Api for Home page
app.get("/", async (req, res) => {
  const htmlResponse = `
    <body>
      <div class="container">
        <h1>Welcome to Mentor 👩‍🏫 and Student 👨‍🎓 Assigning with Database</h1>
        <p>This application allows you This application allows you to manage mentors and students.</p>
        <h4>Send a POST request to /mentors to create a new mentor.</h4>
        <h4>Send a GET request to /mentors to view all mentors</h4>
        <h4>Send a POST request to /mentors/:mentorId/students/:studentId/assign to assign a student to a mentor </h4>
        <h4>Send a POST request to /mentors/:mentorId/students/assign-multiple to assign multiple students to a mentor</h4>
        <h4>Send a PUT request to /students/:studentId/assign-mentor to assign or change the mentor for a student</h4>
        <h4>Send a GET request to /mentors/:mentorId/students to view all students assigned to a particular mentor.</h4>
        <h4>Send a GET request to /students/:studentId/previous-mentor to view the previously assigned mentor for a particular student.</h4>
      </div>
    </body>
  `;
  res.send(`${commonStyles}${htmlResponse}`);
});
// Create Mentor API
app.post("/mentors", async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    const htmlResponse = `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0;">
        <div class="container" style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #333;">Mentor Added</h2>
          <p style="color: #444;">Mentor name: ${mentor.name}</p>
          <p style="color: #444;">Mentor email: ${mentor.email}</p>
          <p>New mentor is added</p>
        </div>
      </body>
    `;
    res.status(201).json(mentor).send(htmlResponse,"New mentor is added");
  } catch (error) {
    console.error("Error creating mentor:", error);
    res.status(500).json({ error: "Error creating mentor" });
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
    res.json(student).statusMessage("Assigned student to mentor");
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
    res.json(students).statusMessage("Assigned multiple student"); 
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
    res.json(student).statusMessage("new mentor is assigned");
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
