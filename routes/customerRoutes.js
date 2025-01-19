const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create a new customer (POST)
router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, location } = req.body;
    const newCustomer = new Customer({ name, email, password, location });
    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully', customer: newCustomer });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});


// Get all customers with optional filtering and pagination (GET)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name, email, location } = req.query;
    const query = {};

    // Filtering based on query parameters
    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    if (email) query.email = { $regex: email, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };

    const customers = await Customer.find(query)
      .limit(limit * 1) // Limit the number of results
      .skip((page - 1) * limit); // Skip the previous pages

    console.log('Retrieved customers:', customers); // Log the retrieved customers

    const count = await Customer.countDocuments(query); // Count total documents
    res.status(200).json({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      customers
    });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Get a customer by ID (GET)
router.get('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Update a customer by ID (PUT)
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, password, location } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, password, location },
      { new: true }
    );
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Delete a customer by ID (DELETE)
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

module.exports = router;