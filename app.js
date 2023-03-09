const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); // middleware


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    // console.log(req.params);
    const id = req.params.id * 1; // convert string to number

    // if (id > tours.length || id < 0) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'invalid id'
    //     });
    // }

    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    });
};

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length || req.params.id * 1 < 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length || req.params.id * 1 < 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        });
    }
    // 204: no content
    res.status(204).json({
        status: 'success',
        data: null
    });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.
    route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});