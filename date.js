exports.getYear = function () {
    let today = new Date()
    let options = {
        year: 'numeric',
    }

    let year = today.toLocaleDateString('en-US', options)

    return year
}