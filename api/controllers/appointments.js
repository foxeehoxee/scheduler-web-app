// TODO: Clean up / "Beautify" code (standard spacing, etc.)

const Model = require('../models/index');
const {Appointment, Slot} = Model;

const Nexmo = require("nexmo");

// Loads configuration settings for environment
const config = require('dotenv').config();

const appointmentController = {
  all(req, res) {
    // Returns all appointments
    Appointment.find({}).exec((err, appointments) => res.json(appointments));
  },
  create(req, res) {
    var requestBody = req.body;

    var newslot = new Slot({
      slot_time: requestBody.slot_time,
      slot_date: requestBody.slot_date,
      created_at: Date.now()
    });
    newslot.save();
    // Creates a new record from a submitted form
    var newappointment = new Appointment({
      name: requestBody.name,
      email: requestBody.email,
      phone: requestBody.phone,
      slots: newslot._id
    });

    const nexmo = new Nexmo({
      apiKey: process.env.SMS_KEY,
      apiSecret: process.env.SMS_SECRET
    });
    
    // TODO: Original msg value. Safe to remove at some point.
    /*
    let msg =
      requestBody.name +
      " " +
      "this message is to confirm your appointment at" +
      " " +
      requestBody.appointment;
    */

    // Saves the record to the database
    newappointment.save((err, saved) => {
      // Returns the saved appointment
      // after a successful save
      Appointment.find({ _id: saved._id })
        .populate("slots")
        .exec((err, appointment) => res.json(appointment));
      
      const from = process.env.SMS_FROM;
      const to = process.env.SMS_TO;

      // TODO: Updated msg value, for now. Pretty this up / finalize at some point.
      let msg = 
      requestBody.name +
      ", " +
      "this message is to confirm your appointment on" +
      " " +
      requestBody.slot_date +
      " " +
      "at " +
      requestBody.slot_time
      
      // TODO: Turn these alerts back on when application is live.
      // Uncomment this next block to hit the SMS api (works) and send text messages. Commenting out for now during development.
      /*
      nexmo.message.sendSms(from, to, msg, (err, responseData) => {
        if (err) {
          console.log(err);
        } else {
          console.dir(responseData);
        }
      });
      */
    });
  }
};

module.exports = appointmentController;

/*
 * Sample JSON *
 * 
{
    "name": "Mark",
    "email": "mark2012@aol.com",
    "phone": 13109510356,
    "slot_time": "1:00 PM",
    "slot_date": "2020-09-01"
}
*/
