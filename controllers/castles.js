const Castle = require('../models/castle');
const mbxGeocondig = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocondig({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary/index');


module.exports.index = async (req, res) => {
    const castles = await Castle.find({});
    res.render("castles/index", { castles })
}

module.exports.newCastle = (req, res) => {
    res.render('castles/new')
}

module.exports.createCastle = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.castle.location,
        limit: 1
    }).send()
    const castle = new Castle(req.body.castle);
    castle.geometry = geoData.body.features[0].geometry;
    castle.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    castle.author = req.user._id;
    await castle.save();
    console.log(castle);
    req.flash('success', 'Castle successfuly added!');
    res.redirect(`/castles/${castle._id}`)
}

module.exports.showCastle = async (req, res) => {
    const castle = await Castle.findById(req.params.id).populate({
        path: 'reviews',
        options: {
            sort: { '_id': -1 }
        },
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!castle) {
        req.flash('error', 'Cannot find that castle!');
        return res.redirect('/castles');
    }
    res.render('castles/show', { castle });
}


module.exports.editCastle = async (req, res) => {
    const { id } = req.params;
    const castle = await Castle.findById(id);
    if (!castle) {
        req.flash('error', 'Cannot find castle!');
        return res.redirect('/castles');
    }
    res.render("castles/edit", { castle });
}

module.exports.updateCastle = async (req, res) => {
    const { id } = req.params;
    const castle = await Castle.findByIdAndUpdate(id, { ...req.body.castle });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    castle.images.push(...imgs);
    await castle.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await castle.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Castle successfully updated!');
    res.redirect(`/castles/${castle._id}`);
}

module.exports.deleteCastle = async (req, res) => {
    const { id } = req.params;
    await Castle.findByIdAndDelete(id);
    req.flash('success', 'Castle successfully deleted!');
    res.redirect('/castles');
}
























// const Castle = require('../models/castle');



// module.exports.index = async (req, res) => {
//     const castles = await Castle.find({});
//     res.render("castles/index", { castles })
// }

// module.exports.newCastle = (req, res) => {
//     res.render('castles/new')
// }

// module.exports.createCastle = async (req, res, next) => {
//     const castle = new Castle(req.body.castle);
//     castle.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     castle.author = req.user._id;
//     await castle.save();
//     req.flash('success', 'Castle successfuly added!');
//     res.redirect(`/castles/${castle._id}`)
// }

// module.exports.showCastle = async (req, res) => {
//     const castle = await Castle.findById(req.params.id).populate({
//         path: 'reviews',
//         options: {
//             sort: { '_id': -1 }
//         },
//         populate: {
//             path: 'author'
//         }
//     }).populate('author');
//     if (!castle) {
//         req.flash('error', 'Cannot find that castle!');
//         return res.redirect('/castles');
//     }
//     res.render('castles/show', { castle });
// }


// module.exports.editCastle = async (req, res) => {
//     const { id } = req.params;
//     const castle = await Castle.findById(id);
//     if (!castle) {
//         req.flash('error', 'Cannot find castle!');
//         return res.redirect('/castles');
//     }
//     res.render("castles/edit", { castle });
// }

// module.exports.updateCastle = async (req, res) => {
//     const { id } = req.params;
//     const castle = await Castle.findByIdAndUpdate(id, { ...req.body.castle });
//     await castle.save();
//     req.flash('success', 'Castle successfully updated!');
//     res.redirect(`/castles/${castle._id}`);
// }

// module.exports.deleteCastle = async (req, res) => {
//     const { id } = req.params;
//     await Castle.findByIdAndDelete(id);
//     req.flash('success', 'Castle successfully deleted!');
//     res.redirect('/castles');
// }