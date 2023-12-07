import Weeklist from "../models/weeklistModel.js";



export const createWeeklist = async (req, res) => {
    try {
        const { isCompleted, markWeeklist, tasks, userId } = req.body;

        // console.log(req.body);

        const obj = {
            isCompleted, markWeeklist, tasks, userId
        };

        const newWeeklist = new Weeklist(obj);
        await newWeeklist.save();

        res.status(200).json({ msg: 'weeklist created', newWeeklist });
    }
    catch (err) {
        res.status(500).json({ msg: err.message });  // status code may be wrong with respect to the given error 
    }
};


export const getAllWeeklists = async (req, res) => {
    try {
        const { userId } = req.body;

        const weeklists = await Weeklist.find({ userId });

        if (weeklists) {
            res.status(200).json({ msg: 'All weeklists of given userId', weeklists });
        }
        else {
            res.status(200).json({ msg: 'No document was found of given user' });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err.message });    // status code may be wrong with respect to the given error
    }
};


export const getWeeklist = async (req, res) => {
    try {
        const weeklistId = req.params.id;

        const weeklist = await Weeklist.findById(weeklistId);

        if (weeklist) {
            res.status(200).json({ msg: 'This is weeklist of given id', weeklist });
        }
        else {
            res.status(200).json({ msg: 'No weeklist was found of given id' });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err.message });     // status code may be wrong with respect to the given error
    }
};


export const getActiveWeeklists = async (req, res) => {
    try {
        const weeklists = await Weeklist.find({});

        if (weeklists) {

            const check = (item) => {
                const date1 = item.createdAt;
                const date2 = new Date();

                const milliseconds = date2 - date1;
                const days = milliseconds / (1000 * 60 * 60 * 24);

                return days < 7;
            }

            const activeWeeklist = weeklists.filter((item) => {
                return check(item);
            })

            // console.log(activeWeeklist);

            res.status(200).json({ msg: 'All active weeklists in database', activeWeeklist });
        }
        else {
            res.status(200).json({ msg: 'No document was found' });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err.message }); // status code may be wrong with respect to the given error
    }
}


export const deleteWeeklist = async (req, res) => {
    try {
        const weeklistId = req.params.id;

        const deletedDocument = await Weeklist.findByIdAndDelete(weeklistId);

        if (deletedDocument) {
            res.status(200).json({ msg: "Weeklist of given id is deleted", deletedDocument });
        }
        else {
            res.status(200).json({ msg: "No weeklist is found of given weeklist id" });
        }

    }
    catch (err) {
        res.status(500).json({ msg: err.message }); // status code may be wrong with respect to the given error
    }
} 