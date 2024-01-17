const Contact = require('../model/contactModel');
const Nf = require("../model/Notificationmodel")

const crypto = require('crypto')


exports.RemovecountOfUserForNF = (req,res)=>{
  try{
     console.log('-------------',req.body.token)
     const result = Nf.findByIdAndDelete({token:req.body.token})
     console.log('------------------',result)

        if (!result) {
      return res.status(404).json({ message: 'token not found' });
    }

    res.json({ status:true ,message: 'Article deleted successfully' });
  }
  catch(err){
    console.error(err)
res.status(500).json({error:err})
  }
}


exports.countOfUserForNF = (req,res)=>{
  try{
    const Token = crypto.randomBytes(8).toString('hex').toUpperCase();

    const notification = new Nf({
      token:Token
    });
     notification.save().then(result => {
      res.status(200).json({status:true , data:result})
  }) .catch(error => {
    console.error('Save failed:', error);
});
  }
  catch(err){
    console.error(err)
res.status(500).json({error:err})
  }
}


exports.submitForm = (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newContact = new Contact({
    name,
    email,
    subject,
    message,
  });

  newContact.save()
  .then(() => {
    return res.status(200).json({ success: true,message:'Form submitted successfully'});
  })
  .catch((err) => {
    console.error('Error saving contact:', err);
    return res.status(500).json({ error: 'Failed to save contact' });
  });

};

exports.getData = (req, res) => {
  Contact.find({})
    .then((contacts) => {
      return res.status(200).json(contacts);
    })
    .catch((err) => {
      console.error('Error retrieving contacts:', err);
      return res.status(500).json({ error: 'Failed to retrieve contacts' });
    });
};



exports.getMonthlySubmissionCounts = async (req, res) => {
  try {
    const monthlySubmissionCounts = await Contact.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(monthlySubmissionCounts);
  } catch (err) {
    console.error('Error retrieving monthly submission counts:', err);
    return res.status(500).json({ error: 'Failed to retrieve monthly submission counts' });
  }
};

