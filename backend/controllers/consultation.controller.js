const { sendConsultationEmail } = require("../config/mailer");

const submitConsultation = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      sofaType,
      approximateSize,
      description,
      selectedFinish,
    } = req.body;

    // Required fields
    if (!name || !phone || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number and sofa description are required.",
      });
    }

    // Basic cleanup
    const consultationData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : "",
      sofaType: sofaType ? String(sofaType).trim() : "",
      approximateSize: approximateSize
        ? String(approximateSize).trim()
        : "",
      description: String(description).trim(),
      selectedFinish: selectedFinish
        ? String(selectedFinish).trim()
        : "",
    };

    await sendConsultationEmail(consultationData);

    return res.status(200).json({
      success: true,
      message:
        "Your consultation request has been submitted successfully.",
    });
  } catch (error) {
    console.error("Consultation email error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your consultation request. Please try again.",
    });
  }
};

module.exports = {
  submitConsultation,
};