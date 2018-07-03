'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const ClassifytSchema = new Schema({
        name: String,
        link: String,
    });
    const Classify = mongoose.model('Classify', ClassifytSchema);
    return Classify;
};