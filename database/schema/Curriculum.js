const mongoose = require("mongoose");

const CurriculumSchema = new mongoose.Schema({
    topic: {
        type: String,
        require: true,
    },

    section: [{
        type: [{
            name: String,
            subsection: {
                type: [{
                    name: String,
                    desc: String,
                    additional_info: [String]
                }]
            }
        }],
        require: true,
    }],

});

module.exports = {
    Curriculum: mongoose.model("Curriculum", CurriculumSchema)
}