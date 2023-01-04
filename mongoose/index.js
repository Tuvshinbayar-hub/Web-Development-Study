const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

main()
    .then("You've been connect!")
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/movieApp');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled


    const movieSchema = new mongoose.Schema({
        name: {
            require: true,
            type: String,
        },
        score: {
            require: true,
            type: Number
        },
        year: {
            type: Number
        },
    })

    movieSchema.virtual("fullName").get(function () {
        return this.name + '' + this.lastName;
    })

    movieSchema.virtual("fullName").set(function (name) {
        const split = name.split(' ');
        this.name = split[0];
        this.lastName = split[1];
    })

    const Movie = mongoose.model("Movie", movieSchema);

    Movie.findOne({ score: 7.2 }, { strict: false }).then(res => { console.log(res.) });


    //await Movie.updateMany({}, { $set: { lastName: 'Darmaa' } }, { strict: false });

    // Movie.insertMany([
    //     { name: 'it', score: 7.2, year: 1998 },
    //     { name: 'Lotr', score: 9.2, year: 2003 },
    //     { name: 'Dark Knight', score: 8.8, year: 2008 }
    // ]);
}
