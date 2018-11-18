const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const User = require('../models/user');
const { verify, verifyAdminRole } = require('../middlewares/auth');

app.post('/user', [verify, verifyAdminRole], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            user: user
        });
    });
});

app.put('/user/:id', [verify, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            user: user
        });
    });
});


app.get('/users', verify, (req, res) => {

    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 5;

    User.find({ state: true }, 'name email role state google img')
        .skip(page * 5)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            User.count({}, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    users
                });
            });
        });
});

app.delete('/user/:id', [verify, verifyAdminRole], (req, res) => {

    let id = req.params.id;
    User.findByIdAndDelete(id, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: deletedUser
        });

    });

});


module.exports = app;