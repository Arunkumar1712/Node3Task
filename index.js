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
//   name: String,
//   email: String,
//   mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
// }
name: {
  type: String,
  required: true,
},
email: {
  type: String,
  required: true,
},
mentor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Mentor',
},
}
);

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
    res.status(201).send(htmlResponse,mentor,"New mentor is added");
  } catch (error) {
    console.error("Error creating mentor:", error);
    res.status(500).json({ error: "Error creating mentor" });
  }
});
// show metors data
app.get("/mentors", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    let mentorList = '';
    mentors.forEach(mentor => {
      mentorList += `
        <div class="mentor" style="margin-bottom: 20px;">
          <h2 style="text-align: center; color: #333;">${mentor.name}</h2>
          <p style="color: #444;">Email: ${mentor.email}</p>
          <p style="color: #444;">mentor_id: ${mentor._id}</p>
        </div>
      `;
    });
    const htmlResponse = `
      <body>
        <div class="container">
          ${mentorList}
        </div>
      </body>
    `;
    res.status(200).send(`${commonStyles}${htmlResponse}`);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ error: "Error fetching mentors" });
    }
  });
// Create Student API
app.post("/students", async (req, res) => {
  try {
    const { name, email, mentor } = req.body; // Extracting name, email, mentor, and previousMentor from the request body
    const student = await Student.create({ name, email, mentor }); // Creating the student with extracted fields
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Error creating student" });
  }
});

// Get all Students API
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    const studentList = students.map(student => `
      <div class="student" style="margin-bottom: 20px;">
        <h2 style="text-align: center; color: #333;">${student.name}</h2>
        <p style="color: #444;">Email: ${student.email}</p>
        <p style="color: #444;">Mentor: ${student.mentor}</p>
       
      </div>
    `).join("");
    const htmlResponse = `
      <body>
        <div class="container">
          ${studentList}
        </div>
      </body>
    `;
    res.status(200).send(`${commonStyles}${htmlResponse}`);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Error fetching students" });
  }
});

// Assign Student to Mentor API
app.post("/mentors/:mentorId/students/:studentId/assign", async (req, res) => {
  try {
    const { mentorId, studentId } = req.params;
    const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId }, { new: true });
    const htmlResponse = `
      <body>
        <div class="container">
          <h2 style="text-align: center; color: #333;">Student Assigned to Mentor</h2>
          <p style="color: #444;">Student ID: ${student._id}</p>
          <p style="color: #444;">Assigned Mentor ID: ${mentorId}</p>
        </div>
      </body>
    `;
    res.send(`${commonStyles}${htmlResponse}`);
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
    const htmlResponse = `
      <body>
        <div class="container">
          <h2 style="text-align: center; color: #333;">Multiple Students Assigned to Mentor</h2>
          <p style="color: #444;">Number of Students: ${students.nModified}</p>
          <p style="color: #444;">Assigned Mentor ID: ${mentorId}</p>
        </div>
      </body>
    `;
    res.send(`${commonStyles}${htmlResponse}`);
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
    const htmlResponse = `
      <body>
        <div class="container">
          <h2 style="text-align: center; color: #333;">New Mentor Assigned to Student</h2>
          <p style="color: #444;">Student ID: ${student._id}</p>
          <p style="color: #444;">New Mentor ID: ${mentorId}</p>
        </div>
      </body>
    `;
    res.send(`${commonStyles}${htmlResponse}`);
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
    let studentList = '';
    students.forEach(student => {
      studentList += `
        <div class="student" style="margin-bottom: 20px;">
          <h2 style="text-align: center; color: #333;">${student.name}</h2>
          <p style="color: #444;">Email: ${student.email}</p>
        </div>
      `;
    });
    const htmlResponse = `
      <body>
        <div class="container">
          ${studentList}
        </div>
      </body>
    `;
    res.send(`${commonStyles}${htmlResponse}`);
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
    const htmlResponse = `
      <body>
        <div class="container">
          <h2 style="text-align: center; color: #333;">Previous Mentor for Student</h2>
          <p style="color: #444;">Student ID: ${student._id}</p>
          <p style="color: #444;">Previous Mentor: ${student.mentor ? student.mentor.name : "None"}</p>
        </div>
      </body>
    `;
    res.send(`${commonStyles}${htmlResponse}`);
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
