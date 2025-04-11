const SiteInfo = require("../models/SiteModel");

// Add Site Info
const addSiteInfo = async (req, res) => {
    try {
        const savedSiteInfo = await SiteInfo.create(req.body);
        res.status(201).json({
            message: "Site information added successfully.",
            data: savedSiteInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Get All Site Info
const getAllSiteInfo = async (req, res) => {
    try {
        const allSites = await SiteInfo.find();
        res.status(200).json({
            message: "Displaying all site information.",
            data: allSites
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Site Info by ID
const getSiteInfoById = async (req, res) => {
    try {
        const siteInfo = await SiteInfo.findById(req.params.id);
        if (!siteInfo) {
            return res.status(404).json({ message: "Site information not found." });
        }
        res.status(200).json({
            message: "Site information found.",
            data: siteInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// update

const updateSiteInfoById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        
        const updatedSiteInfo = await SiteInfo.findByIdAndUpdate(id, updateData, {
            new: true
        });

        if (!updatedSiteInfo) {
            return res.status(404).json({ message: "Site information not found." });
        }

        res.status(200).json({
            message: "Site information updated successfully.",
            data: updatedSiteInfo
        });
    } catch (err) {
        console.error("Error updating site info:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


module.exports = { addSiteInfo, getAllSiteInfo, getSiteInfoById,updateSiteInfoById
    
 };
