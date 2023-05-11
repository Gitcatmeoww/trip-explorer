const Tour = require('../models/tourModel');


exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getAllTours = async (req, res) => {
    try {
        // Build query
        // 1. Filtering
        const queryObj = { ...req.query }; // create a new query object, not the refernce
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2. Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = await Tour.find(JSON.parse(queryStr));

        // 3. Sorting
        if (req.query.sort) {
            const sortFields = req.query.sort.split(',');
            const sortOrder = sortFields.map((field) => field.startsWith('-') ? -1 : 1);

            query = query.sort((a, b) => {
                for (let i = 0; i < sortFields.length; i++) {
                    const field = sortFields[i].replace(/^-/, ''); // Removing the leading '-' if present
                    const order = sortOrder[i];

                    if (a[field] === b[field]) {
                        continue; // If current fields are equal, move to the next field
                    }
                    return (a[field] - b[field]) * order; // Applying sort order to the comparison
                }
            });
        } else { // If user does not specify the sort field, sort by the tour created time in descending order
            query = query.sort((a, b) => {
                b[createdAt] - a[createdAt];
            })
        };

        // Execute query
        const tours = await query;

        // Send response
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id); // Tour.findOne({ _id: req.params.id });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

