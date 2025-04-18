// Backend/controllers/patientController.js
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import axios from "axios";
import fs from "fs";
import path from "path";
// import { processFileWithAI } from "../utils/aiProcessor.js";
import * as tf from "@tensorflow/tfjs";
import { fileURLToPath } from "url";


// Get all doctors with availability
export const getDoctorsWithAvailability = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .select('-password')
      .populate('availability');
    
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, symptoms, date, time } = req.body;
    const patientId = req.user._id;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if time slot is available
    const isAvailable = doctor.availability.some(avail => 
      avail.date === date && avail.timeSlots.includes(time)
    );

    if (!isAvailable) {
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      symptoms,
      date,
      time,
      status: 'Pending'
    });

    await appointment.save();

    // Add to patient's medical history
    await Patient.findByIdAndUpdate(patientId, {
      $push: {
        medicalHistory: {
          doctorId,
          symptoms,
          date,
          time,
          status: 'Pending'
        }
      }
    });

    // Add patient to doctor's patients list if not already there
    await Doctor.findByIdAndUpdate(doctorId, {
      $addToSet: { patients: patientId }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get patient appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'name specialization degree')
      .sort({ createdAt: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
  try {
    const { name, mobile, age, gender, address, bloodGroup, emergencyContact } = req.body;
    const patientId = req.user._id;

    const patient = await Patient.findById(patientId);

    if (patient) {
      patient.name = name || patient.name;
      patient.mobile = mobile || patient.mobile;
      patient.age = age || patient.age;
      patient.gender = gender || patient.gender;
      patient.address = address || patient.address;
      patient.bloodGroup = bloodGroup || patient.bloodGroup;
      patient.emergencyContact = emergencyContact || patient.emergencyContact;

      if (req.file) {
        patient.profileImg = req.file.path;
      }

      const updatedPatient = await patient.save();

      res.json({
        _id: updatedPatient._id,
        name: updatedPatient.name,
        email: updatedPatient.email,
        mobile: updatedPatient.mobile,
        age: updatedPatient.age,
        gender: updatedPatient.gender,
        address: updatedPatient.address,
        bloodGroup: updatedPatient.bloodGroup,
        emergencyContact: updatedPatient.emergencyContact,
        profileImg: updatedPatient.profileImg,
        role: updatedPatient.role,
      });
    } else {
      res.status(404);
      throw new Error("Patient not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const handleChatbotRequest = async (req, res) => {
  const { message } = req.body;

  // Construct the request payload
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Based on the following patient symptoms and history, suggest probable medical conditions and further steps. Ensure the response is concise, accurate, and includes layman-friendly language:

Patient Symptoms: ${message}

Response requirements:
- List 2-3 possible conditions ranked by likelihood.
- Include a one-line explanation for each condition.
- Suggest 1-2 next steps for the patient (e.g., visit a specific specialist, take specific tests).

Format the response as:
1. Condition 1: Explanation
2. Condition 2: Explanation
3. Condition 3: Explanation

Next Steps:
- Step 1
- Step 2

Patient Message: '${message}'`
          }
        ]
      }
    ]
  };

  try {
    // Send the request to the Gemini API
    const apiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the full API response for debugging
    console.log("API Response:", JSON.stringify(apiResponse.data, null, 2));

    // Extract the response message
    const responseMessage =
      apiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated by the API.";

    // Send the response back to the client
    res.status(200).json({ response: responseMessage });
  } catch (error) {
    // Log the error details for debugging
    console.error("Error with Gemini API:", error.message || error);

    // Send an error response to the client
    res.status(500).json({ error: "Unable to process your request. Please try again later." });
  }
};

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeReport = async (req, res) => {
  try {
    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Path to the uploaded file
    const filePath = path.join(__dirname, "../uploads", req.file.filename);

    // Load the file into a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Process file with the AI model
    const analysisResult = await processFileWithAI(fileBuffer);

    // Delete the temporary file
    fs.unlinkSync(filePath);

    // Send the response back to the client
    res.status(200).json({
      message: "Analysis complete",
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("Error analyzing report:", error);

    // Handle errors and send response
    res.status(500).json({
      error: "Failed to process the uploaded report.",
      details: error.message,
    });
  }
};

// AI model processing function using TensorFlow.js
const processFileWithAI = async (fileBuffer) => {
  try {
    // Create a tensor from the file buffer
    const dataTensor = tf.tensor(new Uint8Array(fileBuffer), undefined, 'int32'); // Explicitly specify int32
    console.log("Tensor created:", dataTensor.shape);

    // Convert tensor to float32
    const floatTensor = dataTensor.toFloat();

    // Apply softmax to the float32 tensor
    const resultTensor = tf.softmax(floatTensor);
    const result = await resultTensor.array();

    // Dispose of tensors to free memory
    dataTensor.dispose();
    floatTensor.dispose();
    resultTensor.dispose();
   console.log("Result after softmax:", result);
    return { result };
  } catch (error) {
    console.error("Error in TensorFlow.js processing:", error);
    throw new Error("AI processing failed.");
  }
};
