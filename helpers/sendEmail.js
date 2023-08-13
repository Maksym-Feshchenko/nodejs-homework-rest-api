import nodemailer from "nodemailer"

const {UKR_NET_EMAIL, UKR_NET_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD,
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    const email = {...data, from: UKR_NET_EMAIL};
    return transport.sendMail(email);
}

export default sendEmail;


/* SEND_GRID
import sgMail from "@sendgrid/mail"
// import "dotenv/config";

const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const email = {...data, from: "maksym_feha@ukr.net"};
    await sgMail.send(email);
    return true;
}

export default sendEmail;
*/



