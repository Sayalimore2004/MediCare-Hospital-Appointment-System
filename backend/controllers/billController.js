const Bill = require("../models/Bill");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// Create a new bill
const createBill = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      appointmentId,
      doctorId,
      additionalCharges = 0,
      discount = 0,
      paymentMethod = "UPI",
      billDate,
    } = req.body;

    // Basic validation
    if (
      !patientId ||
      !patientName ||
      !appointmentId ||
      !doctorId ||
      !billDate
    ) {
      return res.status(400).json({
        message:
          "patientId, patientName, appointmentId, doctorId and billDate are required",
      });
    }

    // Find doctor
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Find appointment
    const appointment = await Appointment.findOne({
      appointmentId,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Make sure appointment belongs to patient
    if (appointment.patientId !== patientId) {
      return res.status(400).json({
        message: "Appointment does not belong to this patient",
      });
    }

    // Make sure appointment belongs to doctor
    if (appointment.doctorId !== doctorId) {
      return res.status(400).json({
        message: "Appointment does not belong to this doctor",
      });
    }

    // Prevent duplicate bill for same appointment
    const existingBill = await Bill.findOne({
      appointmentId,
    });

    if (existingBill) {
      return res.status(409).json({
        message: "A bill already exists for this appointment",
        bill: existingBill,
      });
    }

    // Consultation fee comes from Doctor collection
    const consultationFee = Number(doctor.consultationFee) || 0;

    const additional = Number(additionalCharges) || 0;
    const discountAmount = Number(discount) || 0;

    const totalAmount =
      consultationFee + additional - discountAmount;

    if (totalAmount < 0) {
      return res.status(400).json({
        message: "Total amount cannot be negative",
      });
    }

    // Generate Bill ID
    const billCount = await Bill.countDocuments();

    const billId = `BILL${1001 + billCount}`;

    const bill = await Bill.create({
      billId,
      patientId,
      patientName,
      appointmentId,
      doctorId,
      doctorName: doctor.name,
      department: doctor.department,
      consultationFee,
      additionalCharges: additional,
      discount: discountAmount,
      totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
      billDate,
      paymentDate: "",
    });

    res.status(201).json({
      message: "Bill created successfully",
      bill,
    });
  } catch (error) {
    console.error("Create bill error:", error);

    res.status(500).json({
      message: "Failed to create bill",
      error: error.message,
    });
  }
};


// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({
      createdAt: -1,
    });

    res.status(200).json(bills);
  } catch (error) {
    console.error("Get all bills error:", error);

    res.status(500).json({
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
};


// Get bills for a patient
const getPatientBills = async (req, res) => {
  try {
    const { patientId } = req.params;

    const bills = await Bill.find({
      patientId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(bills);
  } catch (error) {
    console.error("Get patient bills error:", error);

    res.status(500).json({
      message: "Failed to fetch patient bills",
      error: error.message,
    });
  }
};


// Get one bill
const getBillById = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await Bill.findOne({
      billId,
    });

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error("Get bill error:", error);

    res.status(500).json({
      message: "Failed to fetch bill",
      error: error.message,
    });
  }
};


// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { billId } = req.params;

    const {
      paymentStatus,
      paymentMethod,
      paymentDate,
    } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
      "Refunded",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const bill = await Bill.findOne({
      billId,
    });

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    bill.paymentStatus = paymentStatus;

    if (paymentMethod) {
      bill.paymentMethod = paymentMethod;
    }

    if (paymentDate !== undefined) {
      bill.paymentDate = paymentDate;
    }

    await bill.save();

    res.status(200).json({
      message: "Payment status updated successfully",
      bill,
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    res.status(500).json({
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};


module.exports = {
  createBill,
  getAllBills,
  getPatientBills,
  getBillById,
  updatePaymentStatus,
};