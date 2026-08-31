const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendConsultationEmail = async (data) => {
  const {
    name,
    phone,
    email,
    sofaType,
    approximateSize,
    description,
    selectedFinish,
  } = data;

  const mailOptions = {
    from: `"DecorDen Website" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,

    subject: `New Sofa Consultation Request - ${name}`,

    text: `
New Sofa Consultation Request

--------------------------------
CUSTOMER DETAILS
--------------------------------

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}

--------------------------------
SOFA DETAILS
--------------------------------

Selected Finish: ${selectedFinish || "Not specified"}
Sofa Type: ${sofaType || "Not specified"}
Approximate Size: ${approximateSize || "Not specified"}

--------------------------------
CUSTOMER REQUIREMENTS
--------------------------------

${description}

--------------------------------
Submitted from DecorDen website
--------------------------------
`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; color: #333;">

        <div style="background:#3d7027; padding:24px; color:white;">
          <h2 style="margin:0;">New Sofa Consultation Request</h2>
          <p style="margin:8px 0 0;">
            A customer has submitted a consultation request.
          </p>
        </div>

        <div style="padding:24px; border:1px solid #eee;">

          <h3 style="margin-top:0;">Customer Details</h3>

          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee;"><strong>Name</strong></td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${name}</td>
            </tr>

            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee;"><strong>Phone</strong></td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${phone}</td>
            </tr>

            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee;"><strong>Email</strong></td>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                ${email || "Not provided"}
              </td>
            </tr>
          </table>

          <h3 style="margin-top:30px;">Sofa Details</h3>

          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                <strong>Selected Finish</strong>
              </td>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                ${selectedFinish || "Not specified"}
              </td>
            </tr>

            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                <strong>Sofa Type</strong>
              </td>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                ${sofaType || "Not specified"}
              </td>
            </tr>

            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                <strong>Approximate Size</strong>
              </td>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                ${approximateSize || "Not specified"}
              </td>
            </tr>
          </table>

          <h3 style="margin-top:30px;">Customer Requirements</h3>

          <div style="
            background:#f7f7f5;
            padding:18px;
            border-left:4px solid #3d7027;
            line-height:1.6;
          ">
            ${description}
          </div>

        </div>

        <div style="padding:20px; text-align:center; color:#888; font-size:12px;">
          This consultation request was submitted through your website.
        </div>

      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendConsultationEmail,
};