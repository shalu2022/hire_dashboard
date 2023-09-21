const asyncErrorHandler = require("express-async-handler");
const ActiveJobData = require("../data/activeJobData")

const getAllJobs = asyncErrorHandler(async (req,res)=>{
    res.json(ActiveJobData)
})

module.exports = {getAllJobs}