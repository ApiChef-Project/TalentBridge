import Company from "../models/company.model.js";

export const fetchCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json(companies);
  } catch (error) {
    console.error(`GET all companies Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid Company ID" });
    console.error(`GET company by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const { name, description, email, password, phone } = req.body;

    // Validation
    if (!name || !description || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res
        .status(400)
        .json({ error: `Company with email ${email} already exists` });
    }

    const newCompany = new Company({
      name,
      description,
      email,
      hashedPassword: password, // Assuming password is hashed before saving
      phone,
    });
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    if (error.name === "ValidationError")
      return res
        .status(400)
        .json({ error: error.message.split(":")[2].trim() });
    console.error(`POST Company Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, email, password, phone } = req.body;

    // Validate request data
    if (!name || !description || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    company.name = name;
    company.description = description;
    company.email = email;
    company.hashedPassword = password;
    company.phone = phone;

    await company.save();
    res.status(200).json(company);
  } catch (error) {
    if (error.name === "ValidationError")
      return res
        .status(400)
        .json({ error: error.message.split(":")[2].trim() });
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid Company ID" });
    console.error(`PUT company by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCompany = async (req, res) => {
  console.log("We in here");
  const { id } = req.params;
  try {
    const company = await Company.findById(id);
    if (!company) return res.status(400).json({ error: "Company Not Found" });
    await company.deleteOne();
    return res.status(200).json({ message: "Successfully Deleted Company" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid Company ID" });
    console.error(`DELETE company by id Controller Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
