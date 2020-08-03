// TODO: Clean up / "Beautify" code (standard spacing, etc.)

const Model = require('../models/index');
const {Appointment, Slot} = Model;

const Nexmo = require("nexmo");

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

    // TODO: Read this in from .gitIgnored config file
    // Replace here after committing to source control.

    /*
    const nexmo = new Nexmo({
      apiKey: "YOUR_API_KEY",
      apiSecret: "YOUR_API_SECRET"
    });
    */
    
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

      /*
      // Update these with the vonage / nexmo number and your whitelisted recipient number.
      const from = VIRTUAL_NUMBER;
      const to = RECIPIENT_NUMBER;
      */
      
      // TODO: Read this in from .gitIgnored config file
      // Replace here after committing to source control.


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
      
      // TODO: Activate this for reals when development is complete and app is live.
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
