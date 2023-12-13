import Weeklist from "../models/weeklistModel.js";



export const createWeeklist = async (req, res) => {
    try {
        const { markWeeklist, tasks, userId } = req.body;
        const obj = {
            markWeeklist, tasks, userId
        };

        const weeklists = await Weeklist.find({ userId });

        if (weeklists) {

            const check = (item) => {
                const date1 = item.createdAt;
                const date2 = new Date();

                const milliseconds = date2 - date1;
                const days = milliseconds / (1000 * 60 * 60 * 24);

                return (days < 7 && !(item.isCompleted));
            }

            const activeAndNotCompleted = weeklists.filter((item) => {
                return check(item);
            })

            if (activeAndNotCompleted.length < 2) {
                let cnt = 0;

                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].markTask) {
                        cnt++;
                    }
                }

                if (cnt === tasks.length) {
                    obj.isCompleted = true;
                }
                else {
                    obj.isCompleted = false;
                }

                const newWeeklist = new Weeklist(obj);
                await newWeeklist.save();

                return res.status(200).json({ msg: 'weeklist created', newWeeklist });
            }
            else {
                return res.status(400).json({ msg: 'User has already 2 active weeklist. New weeklist cannot be created.' });
            }
        }
        else {
            const newWeeklist = new Weeklist(obj);
            await newWeeklist.save();

            return res.status(200).json({ msg: 'weeklist created', newWeeklist });
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });  // status code may be wrong with respect to the given error 
    }
};


export const checkDeadlineForTask = async (req, res, next) => {
    try {
        const { weeklistId } = req.body;

        const weeklist = await Weeklist.findById(weeklistId);
        const milliseconds = new Date() - weeklist.createdAt;

        const hours = milliseconds / (60 * 60 * 1000);
        if (hours >= 24) {
            return res.status(200).json({ msg: 'Task cannot be updated because 24 hours has been passed since Weeklist is created' });
        }
        else {
            next();
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const { weeklistId, taskInd } = req.body;

        const weeklist = await Weeklist.findById(weeklistId);
        console.log(weeklist);

        const arr = weeklist.tasks.filter((item, ind) => {
            return ind !== taskInd;
        });

        const updatedWeeklist = await Weeklist.findByIdAndUpdate(weeklistId, { tasks: arr });
        console.log(updatedWeeklist);

        return res.status(200).json({ msg: 'Task deleted successfully', updatedWeeklist });
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const updateTask = async (req, res) => {
    try {
        const { weeklistId, taskInd, taskVal } = req.body;

        const weeklist = await Weeklist.findById(weeklistId);
        console.log(weeklist);

        let arr = [...weeklist.tasks];
        arr[taskInd].description = taskVal;

        const updatedWeeklist = await Weeklist.findByIdAndUpdate(weeklistId, { tasks: arr });
        console.log(updatedWeeklist);

        return res.status(200).json({ msg: 'Task updated successfully', updatedWeeklist });
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const markUnmarkTask = async (req, res) => {
    try {

        const { weeklistId, taskInd, mark } = req.body;

        const weeklist = await Weeklist.findById(weeklistId);
        console.log(weeklist);

        let arr = [...weeklist.tasks];
        let completed = false;

        if (mark) {
            arr[taskInd].markTask = true;

            let cnt = 0;

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].markTask) {
                    cnt++;
                }
            }

            if (cnt === arr.length) {
                completed = true;
            }
        }
        else {
            if (weeklist.isCompleted) {
                return res.status(200).json({ msg: 'Task cannot be unmarked because Weeklist is completed' });
            }
            else {
                arr[taskInd].markTask = false;
            }
        }


        const updatedWeeklist = await Weeklist.findByIdAndUpdate(weeklistId, { tasks: arr, isCompleted: completed });
        console.log(updatedWeeklist);

        return res.status(200).json({ msg: 'Task updated successfully', updatedWeeklist });
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const getUserActiveWeeklistWithTime = async (req, res) => {
    const { userId } = req.body;

    try {
        const weeklists = await Weeklist.find({ userId });

        if (weeklists) {

            const check = (item) => {
                const date1 = item.createdAt;
                const date2 = new Date();

                const milliseconds = date2 - date1;
                const days = milliseconds / (1000 * 60 * 60 * 24);

                return days < 7;
            }

            let activeWeeklist = weeklists.filter((item) => {
                return check(item);
            })

            activeWeeklist = activeWeeklist.map((item) => {
                const milliseconds = new Date() - item.createdAt;

                let second = Math.floor(milliseconds / 1000);
                let minute = Math.floor(second / 60);
                second = second % 60;

                let hour = Math.floor(minute / 60);
                minute = minute % 60;

                let day = hour / 24;
                hour = hour % 24;

                item.timeLeft = `${day}day ${hour}hour ${minute}minute ${second}second`;
                return item;
            })

            console.log(activeWeeklist);

            return res.status(200).json({ msg: 'All active weeklists in database', activeWeeklist });
        }
        else {
            return res.status(200).json({ msg: 'No document was found' });
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message }); // status code may be wrong with respect to the given error
    }
};


export const getWeeklist = async (req, res) => {
    try {
        const weeklistId = req.params.id;

        const weeklist = await Weeklist.findById(weeklistId);

        if (weeklist) {
            return res.status(200).json({ msg: 'This is weeklist of given id', weeklist });
        }
        else {
            return res.status(200).json({ msg: 'No weeklist was found of given id' });
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });     // status code may be wrong with respect to the given error
    }
};


export const getAllActiveWeeklist = async (req, res) => {
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

            console.log(activeWeeklist);

            return res.status(200).json({ msg: 'All active weeklists in database', activeWeeklist });
        }
        else {
            return res.status(200).json({ msg: 'No document was found' });
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message }); // status code may be wrong with respect to the given error
    }
};


export const checkDeadlineForWeeklist = async (req, res, next) => {
    try {
        const { weeklistId } = req.body;

        const weeklist = await Weeklist.findById(weeklistId);
        const milliseconds = new Date() - weeklist.createdAt;

        const day = milliseconds / (24 * 60 * 60 * 1000);
        if (day >= 7) {
            return res.status(200).json({ msg: 'Weeklist cannot be updated because 7 days has been passed since Weeklist is created' });
        }
        else {
            next();
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const markUnmarkWeeklist = async (req, res) => {
    try {
        const { weeklistId, mark } = req.body;

        const updatedWeeklist = await Weeklist.findByIdAndUpdate(weeklistId, { markWeeklist: mark });
        console.log(updatedWeeklist);

        return res.status(200).json({ msg: 'Weeklist updated successfully', updatedWeeklist });
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const getAllWeeklistsOfUser = async (req, res) => {
    try {
        const { userId } = req.body;

        const weeklists = await Weeklist.find({ userId });

        if (weeklists) {
            return res.status(200).json({ msg: 'All weeklists of given userId', weeklists });
        }
        else {
            return res.status(200).json({ msg: 'No document was found of given user' });
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });    // status code may be wrong with respect to the given error
    }
};


export const deleteWeeklist = async (req, res) => {
    try {
        const weeklistId = req.params.id;

        const deletedDocument = await Weeklist.findByIdAndDelete(weeklistId);

        if (deletedDocument) {
            return res.status(200).json({ msg: "Weeklist of given id is deleted", deletedDocument });
        }
        else {
            return res.status(200).json({ msg: "No weeklist is found of given weeklist id" });
        }

    }
    catch (err) {
        return res.status(500).json({ msg: err.message }); // status code may be wrong with respect to the given error
    }
};











