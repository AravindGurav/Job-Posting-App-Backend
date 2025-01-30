const express = require("express")
const app = express()
app.use(express.json())

//CORS
const cors = require("cors")
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Connect to Database

const { initializeDatabase } = require("./db/db.connect")
initializeDatabase()

const PORT = 3000

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get("/", (req, res) => {
  res.send("Hello express server")
})

//import Job Model
const Job = require("./models/job.models")

//sample data




// API Endpoints
// Function to create a new job
async function createJob(jobData) {
  try {
       const newJob = new Job(jobData)
       const savedJob =await newJob.save()
     //   console.log("Saved Job:", savedJob)
       return savedJob
    
  } catch (error) {
    console.log("Error in saving the job", error)
  }
}

// createJob(jobData)

app.post("/jobs", async (req, res) => {
  try {
       const savedJob = await createJob(req.body)
       if (savedJob) {
               res.status(201).json({
                     message: "Job added successfully",
                     job: savedJob
               })
       } else {
               res.status(400).json(error)
       }

  } catch (error) {
    res.status(500).json({ error: "Failed to add a job" })
  }
})



// Function to get all jobs
async function getAllJobs() {
  try {
       const allJobs = await Job.find()
     //   console.log("All Jobs:", allJobs)
       return allJobs
  } catch (error) {
    console.log("Error in getting the jobs", error)
  }
}

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await getAllJobs()
    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



// Function to get a job by ID
async function getJobById(jobId) {
  try {
       const job = await Job.findById(jobId)
     //   console.log(job)
       return job
  } catch (error) {
    console.log("Error in getting the job by it's id",error)
  }
}

app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await getJobById(req.params.id)
    if (!job) return res.status(404).json({ message: "Job not found" })
    res.status(200).json(job)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// Function to update a job by ID
async function updateJobById(jobId, jobData) {
  try {
    const updatedJob =  await Job.findByIdAndUpdate(jobId, jobData, {
      new: true,
    })
       return updatedJob
  } catch (error) {
    throw new Error(error.message)
  }
}
app.post("/jobs/:id", async (req, res) => {
  try {
    const updatedJob = await updateJobById(req.params.id, req.body)
     if (updatedJob) {
       res.status(200).json({
         message: "Job updated successfully.",
         updatedJob,
       })
     } else {
       res.status(404).json({ error: "Job not found" })
     }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})



// Function to delete a job by ID
async function deleteJobById(jobId) {
  try {
       const deletedJob = await Job.findByIdAndDelete(jobId)
       return deletedJob
  } catch (error) {
    console.log(error)
  }
}

app.delete("/jobs/:id", async (req, res) => {
  try {
    const deletedJob = await deleteJobById(req.params.id)
    if (!deletedJob) return res.status(404).json({ message: "Job not found" })
       res.status(200).json({
            message: "Job deleted successfully",
Job: deletedJob       })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
