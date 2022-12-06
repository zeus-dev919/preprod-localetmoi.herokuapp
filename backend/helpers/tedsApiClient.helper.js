module.exports = {
    urlFormatter: (url) => {
        return url.replace(/https?:\/\/(www\.)?/, '');
    }
}
