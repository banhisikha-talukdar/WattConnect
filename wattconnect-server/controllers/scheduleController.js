const Schedule = require('../models/Schedule');

const isValidConsumerNumber = (number) => /^\d{12}$/.test(number);

exports.scheduleMeterVisit = async (req, res) => {
  console.log("📩 Incoming request body for Meter:", req.body);
  const {
    consumerNumber,
    district,
    subdivision,
    applicantName,
    address,
    preferredDate,
    usageType,
    reason
  } = req.body;

  if (!isValidConsumerNumber(consumerNumber)) {
    return res.status(400).json({ error: 'Invalid consumer number. Must be 12 digits.' });
  }

  try {
    const newSchedule = new Schedule({
      consumerNumber,
      formType: 'meter',
      district,
      subdivision,
      applicantName,
      address,
      preferredDate,
      usageType,
      reason
    });

    await newSchedule.save();
    console.log('✅ Meter schedule saved:', newSchedule);
    res.status(201).json({ message: 'Meter visit scheduled successfully' });
  } catch (err) {
    console.error('❌ Meter schedule error:', err);
    res.status(500).json({ error: 'Server error while scheduling meter visit' });
  }
};

exports.scheduleEngineerVisit = async (req, res) => {
  const {
    consumerNumber,
    district,
    subdivision,
    applicantName,
    address,
    preferredDate,
    usageType,
    reason
  } = req.body;

  if (!isValidConsumerNumber(consumerNumber)) {
    return res.status(400).json({ error: 'Invalid consumer number. Must be 12 digits.' });
  }

  try {
    const newSchedule = new Schedule({
      consumerNumber,
      formType: 'engineer',
      district,
      subdivision,
      applicantName,
      address,
      preferredDate,
      usageType,
      reason
    });

    await newSchedule.save();
    console.log('✅ Engineer schedule saved:', newSchedule);
    res.status(201).json({ message: 'Engineer visit scheduled successfully' });
  } catch (err) {
    console.error('❌ Engineer schedule error:', err);
    res.status(500).json({ error: 'Server error while scheduling engineer visit' });
  }
};

exports.getSchedules = async (req, res) => {
  const { type, consumerNumber } = req.query;

  if (type && !['meter', 'engineer'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Must be "meter" or "engineer"' });
  }

  try {
    const query = {};
    if (type) query.formType = type;
    if (consumerNumber) query.consumerNumber = consumerNumber;

    const schedules = await Schedule.find(query).sort({ preferredDate: 1 });
    res.status(200).json(schedules);
  } catch (err) {
    console.error('❌ Fetch schedule error:', err);
    res.status(500).json({ error: 'Server error while fetching schedules' });
  }
};
