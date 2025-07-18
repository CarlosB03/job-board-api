import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

//CREATE
export const addJobs = async (req, res) => {
    const {title, company, jobDescription, requirements, responsibilities, pay, location, skills} = req.body;
    try {

        // Turn each field into a key, value pair then loop through each required field and check if it's missing or empty.
        // If any field is undefined, null, or an empty string, return a 400 error with the missing field's name.
        const requiredFields = { title, company, jobDescription, requirements, responsibilities, pay, location, skills };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined || value === null || value === '') {
                return res.status(400).json({ message: `Missing field: ${key}` });
            }
        }

        const job = await prisma.job.create({
            data: {title, 
                company, 
                jobDescription, 
                requirements, 
                responsibilities, 
                pay, 
                location, 
                skills,
                userId: req.user.id
            }
        })

        res.status(201).json({success: true, data: job})
    } catch (error) {
        res.status(500).json({message: "Server error", details: error.message});
    }

}

//READ
export const getJobs = async (req, res) => {
    const { fields, sort, ...filters } = req.query;

    try {
        let select;
        if (fields) {
            const requestedFields = fields.split(',').map(f => f.trim());
            select = requestedFields.reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {});
        }

        // Build a "where" filter object for Prisma
        const where = {};
        for (const key in filters) {
            where[key] = {
                contains: filters[key], // for partial matching (case-sensitive)
                mode: 'insensitive'     // make it case-insensitive
            };
        }
        
        console.log("WHERE filters:", where);
        const jobs = await prisma.job.findMany({
            where,
            select
        });

        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
}


//UPDATE
export const updateJobs = async (req, res) => {
    const {title, company, jobDescription, requirements, responsibilities, pay, location, skills} = req.body;
    try {
        const jobId = parseInt(req.params.id)

        //Find the Job
        const job = await prisma.job.findUnique({where: {id: jobId}});
        if (!job) {
            res.status(404).json({message: "Job not found"})
        }
        
        //Check if the user is the owner
        if (job.userId !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own jobs" });
        }

        // Update only the fields provided, fallback to existing values
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                title: title || job.title,
                company: company || job.company,
                jobDescription: jobDescription || job.jobDescription,
                requirements: requirements || job.requirements,
                responsibilities: responsibilities || job.responsibilities,
                pay: pay || job.pay,
                location: location || job.location,
                skills: skills || job.skills,
            }
        });

        res.status(200).json({ success: true, data: updatedJob });

    } catch (error) {
        res.status(500).json({ message: "Server error", details: err.message });
    }
}

//DELETE
export const deleteJobs = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);

        const job = prisma.job.findUnique({where: {id: jobId}})

        if (!job || job.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized or job not found' });
        }

        await prisma.job.delete({ where: { id: jobId } });
        res.status(200).json({ success: true, message: 'Job deleted' });  
    } catch (error) {
        res.status(500).json({ message: "Server error", details: err.message });
    }


}

