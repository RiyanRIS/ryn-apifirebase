'use strict';

const firebase = require('../db');
const Quote = require('../models/quote');
const firestore = firebase.firestore();

const quoteColl = firestore.collection('quote');

const add = async (req, res, next) => {
    try {
        const data = req.body;
        await quoteColl.doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAll = async (req, res, next) => {
    try {
        const quotes = await quoteColl;
        const data = await quotes.get();
        const quotesArray = [];
        if(data.empty) {
            res.status(404).send('No quotes record found');
        }else {
            data.forEach(doc => {
                const quote = new Quote(
                    doc.id,
                    doc.data().quote,
                    doc.data().from,
                );
                quotesArray.push(quote);
            });
            res.send(quotesArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const get = async (req, res, next) => {
    try {
        const id = req.params.id;
        const quote = await quoteColl.doc(id);
        const data = await quote.get();
        if(!data.exists) {
            res.status(404).send('Quote with the given ID not found');
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
        const quote =  await quoteColl.doc(id);
        await quote.update(data);
        res.send('Quote record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const del = async (req, res, next) => {
    try {
        const id = req.params.id;
        await quoteColl.doc(id).delete();
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