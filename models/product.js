const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, reqired: true},
    description: { type: String},
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true},
    price: { type: Number, required: true},
    image: {type: String},
    stockAmount: { type: Number, required: true}
})

ProductSchema.virtual("url").get(function() {
    return `/product/${this._id}`;
})

module.exports = mongoose.model("Product", ProductSchema);