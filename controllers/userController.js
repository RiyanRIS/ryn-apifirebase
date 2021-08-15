'use strict';

const firebase = require('../db');
const User = require('../models/user');
const firestore = firebase.firestore();

const userColl = firestore.collection('user');


const add = async (req, res, next) => {
    try {
        const data = req.body;
        await userColl.doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAll = async (req, res, next) => {
    try {
        const users = await userColl;
        const data = await users.get();
        const usersArray = [];
        if(data.empty) {
            res.status(404).send('No user record found');
        }else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().nama,
                    doc.data().nama_depan,
                    doc.data().nohp,
                    doc.data().alamat
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const get = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userColl.doc(id);
        const data = await user.get();
        if(!data.exists) {
            res.status(404).send('User with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const upd = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user =  await userColl.doc(id);
        await user.update(data);
        res.send('User record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const del = async (req, res, next) => {
    try {
        const id = req.params.id;
        await userColl.doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    add,
    getAll,
    get,
    upd,
    del
}