export const serverHealth = (req, res) => {
    res.status(200).json({
        msg: {
            serverName: 'weeklist server',
            currentTime: new Date(),
            state: 'active'
        }
    });
}