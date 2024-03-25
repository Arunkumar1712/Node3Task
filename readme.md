
 Mentor-Student Assignment Application

This application allows you to manage mentors and students, assign students to mentors, and perform various operations related to mentor-student relationships.

Live demo Url :"https://node3task.onrender.com"
Endpoints

Home page:

GET :"https://node3task.onrender.com/"
Create Mentor

To create a mentor, use the following endpoint:

```
POST :"https://node3task.onrender.com/mentors"
```

 Get All Mentors

To get a list of all mentors, use the following endpoint:

```
GET /mentors :"https://node3task.onrender.com/mentors"
```

Create Student

To create a student, use the following endpoint:

```
POST /students :"https://node3task.onrender.com/students"
```

Assign Student to Mentor

To assign a student to a mentor, use the following endpoint:

```
POST /mentors/:mentorId/students/:studentId/assign
Link :"https://node3task.onrender.com/mentors/:mentorId/students/:studentId/assign"
```

Assign Multiple Students to a Mentor

To assign multiple students to a mentor, use the following endpoint:

```
POST /mentors/:mentorId/students/assign-multiple
Link :"https://node3task.onrender.com/mentors/:mentorId/students/assign-multiple"
```

Assign or Change Mentor for a Student

To assign or change the mentor for a student, use the following endpoint:

```
PUT /students/:studentId/assign-mentor
Link :"https://node3task.onrender.com/students/:studentId/assign-men"
```

Show all Students for a particular Mentor

To show all students assigned to a particular mentor, use the following endpoint:

```
GET /mentors/:mentorId/students
Link :"https://node3task.onrender.com/mentors/:mentorId/students"
```

Show the Previously Assigned Mentor for a particular Student

To show the previously assigned mentor for a particular student, use the following endpoint:

```
GET /students/:studentId/previous-mentor
Link :"https://node3task.onrender.com/students/:studentId/previous-mentor"
```
How to Use

1. Send a POST request to `/mentors` to create a new mentor.
2. Send a GET request to `/mentors` to view all mentors.
3. Send a POST request to `/students` to create a new student.
4. Send a POST request to `/mentors/:mentorId/students/:studentId/assign` to assign a student to a mentor.
5. Send a POST request to `/mentors/:mentorId/students/assign-multiple` to assign multiple students to a mentor.
6. Send a PUT request to `/students/:studentId/assign-mentor` to assign or change the mentor for a student.
7. Send a GET request to `/mentors/:mentorId/students` to view all students assigned to a particular mentor.
8. Send a GET request to `/students/:studentId/previous-mentor` to view the previously assigned mentor for a particular student.

Technologies Used

- Node.js
- Express.js
- MongoDB

Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file and configure the MongoDB connection URL.
4. Start the server using `npm start`.

Contributing

Contributions to the project are welcome! Fork the repository, make your changes, and submit a pull request for review.

