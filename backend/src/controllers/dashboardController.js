

export const getFriends= async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: 'getFriends'
    })
}