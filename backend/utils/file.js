const mimeTypes = {
    'aac': 'audio/aac',
    'abw': 'application/x-abiword',
    'ai': 'application/illustrator',
    'arc': 'application/octet-stream',
    'avi': 'video/x-msvideo',
    'azw': 'application/vnd.amazon.ebook',
    'bin': 'application/octet-stream',
    'bmp': 'image/bmp',
    'bz': 'application/x-bzip',
    'bz2': 'application/x-bzip2',
    'conf': 'text/plain',
    'csh': 'application/x-csh',
    'css': 'text/css',
    'csv': 'text/csv',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'eot': 'application/vnd.ms-fontobject',
    'epub': 'application/epub+zip',
    'eps': [
        'application/postscript',
        'application/eps',
        'application/x-eps',
        'image/eps',
        'image/x-eps'
    ],
    'gif': 'image/gif',
    'heic': [
        'image/heif',
        'image/heic',
        'image/heif-sequence',
        'image/heic-sequence'
    ],
    'htm': 'text/html',
    'html': 'text/html',
    'ico': [
        'image/x-icon',
        'image/vnd.microsoft.icon'
    ],
    'ics': 'text/calendar',
    'jar': 'application/java-archive',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'js': [
        'application/ecmascript',
        'application/javascript',
        'application/x-ecmascript',
        'application/x-javascript',
        'text/ecmascript',
        'text/javascript',
        'text/jscript',
        'text/jscript',
        'text/x-ecmascript',
        'text/x-javascript'
    ],
    'json': 'application/json',
    'log': 'text/plain',
    'mid': 'audio/midi',
    'midi': 'audio/midi',
    'mpeg': 'video/mpeg',
    'mpkg': 'application/vnd.apple.installer+xml',
    'odp': 'application/vnd.oasis.opendocument.presentation',
    'ods': 'application/vnd.oasis.opendocument.spreadsheet',
    'odt': 'application/vnd.oasis.opendocument.text',
    'oga': 'audio/ogg',
    'ogv': 'video/ogg',
    'ogx': 'application/ogg',
    'otf': 'font/otf',
    'pages': [
        'application/x-iwork-pages-sffpages',
        'application/vnd.apple.pages'
    ],
    'png': 'image/png',
    'pdf': 'application/pdf',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'psd': [
        'image/photoshop',
        'image/x-photoshop',
        'image/psd',
        'application/photoshop',
        'application/psd',
        'zz-application/zz-winassoc-psd'
    ],
    'rar': 'application/x-rar-compressed',
    'rtf': 'application/rtf',
    'sh': 'application/x-sh',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tar': 'application/x-tar',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'ts': 'application/typescript',
    'ttf': 'font/ttf',
    'txt': 'text/plain',
    'vsd': 'application/vnd.visio',
    'wav': 'audio/x-wav',
    'weba': 'audio/webm',
    'webm': 'video/webm',
    'webp': 'image/webp',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'xhtml': 'application/xhtml+xml',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xml': 'application/xml',
    'xul': 'application/vnd.mozilla.xul+xml',
    'zip': 'application/zip',
    '3gp': [
        'video/3gpp',
        'audio/3gpp'
    ],
    '3g2': [
        'video/3gpp2',
        'audio/3gpp2'
    ],
    '7z': 'application/x-7z-compressed',
};

const allowedExtensions = process.env.ALLOWED_UPLOAD_EXTENSIONS;

/**
 * @returns {string[]}
 */
function getAllowedExtensions() {
    return allowedExtensions.split(',').map(ext => `.${ext}`);
}

/**
 * @param {object} file
 * @returns {boolean}
 */
function isFileAuthorized(file) {
    const fileExtension = (file.name || file.originalname).split('.').pop().toLowerCase();
    const availableExptensions = allowedExtensions.split(',');
    if (-1 === availableExptensions.indexOf(fileExtension)) {
        return false;
    }

    const availableMimeType = mimeTypes[fileExtension];
    const mimeType = file.type || file.mimetype;

    switch (true) {
        case Array.isArray(availableMimeType):
            return !!availableMimeType.find(item => -1 !== mimeType.indexOf(item));
        case 'string' === typeof availableMimeType:
            return availableMimeType === mimeType;
    }

    return false;
}

module.exports = {
    getAllowedExtensions,
    isFileAuthorized,
};
