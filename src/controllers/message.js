
const uploadImage = async (req, res) => {
    try {
        let pictureFiles = req.files;
        if (!pictureFiles)
            return res.status(400).json({ message: "No picture attached!" });

        let imageStr = pictureFiles.reduce((imageStr, image) => {
            return imageStr + "|" + image.path;
        }, "");
        return res.json({ image: imageStr });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

module.exports = {
    uploadImage
}