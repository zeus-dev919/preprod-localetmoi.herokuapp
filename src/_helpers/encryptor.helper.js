const RSASign = require('jsrsasign');
const jwtDecode = require('jwt-decode');
const base64UrlDecode = require('jwt-decode/lib/base64_url_decode');

export const encryptorHelpers = {
    bin2hex,
    decodeToken,
    verifyToken,
    TokenExpiredException,
    RefreshTokenExpiredException
};

class InvalidTokenClaimException {
    constructor (message) {
        this.message = message;
        this.name = 'InvalidTokenClaimException';
    }
}

class InvalidTokenFormatException {
    constructor () {
        this.message = 'Invalid token format';
        this.name = 'InvalidTokenFormatException';
    }
}

class InvalidTokenSignatureException {
    constructor () {
        this.message = 'Invalid token signature';
        this.name = 'InvalidTokenSignatureException';
    }
}

class TokenExpiredException {
    constructor () {
        this.message = 'Token has expired';
        this.name = 'TokenExpiredException';
    }
}

class RefreshTokenExpiredException {
    constructor () {
        this.message = 'Refresh token has expired';
        this.name = 'RefreshTokenExpiredException';
    }
}

function bin2hex (s) {
    var i, l, o = '', n;
    s += '';
    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? '0' + n : n;
    }

    return o;
}

function decodeToken (token) {
    return jwtDecode(token);
}

function expiredToken (token) {
    if (!token.hasOwnProperty('exp')) {
        throw new InvalidTokenClaimException('Token claim missing: "exp"');
    }
    if (Math.floor(Date.now() / 1000) > token.exp) {
        throw new TokenExpiredException();
    }
}

function verifyToken (token) {
    verifyTokenSignature(token);

    const decodedToken = decodeToken(token);
    if (!decodedToken.hasOwnProperty('sub')) {
        throw new InvalidTokenClaimException('Token claim missing: "sub"');
    }
    expiredToken(decodedToken);

    return decodedToken;
}

function verifyTokenSignature (token) {
    let key = RSASign.KEYUTIL.getKey(process.env.LOCALFR_API_OAUTH2_PUBLIC_KEY);
    let tokenParts = token.split('.');

    if (tokenParts.length < 3) {
        throw new InvalidTokenFormatException();
    }

    let payloadHash = RSASign.KJUR.crypto.Util.sha256(tokenParts[0] + '.' + tokenParts[1]);
    let hexSig = bin2hex(base64UrlDecode(tokenParts[2]));

    if (key.verifyWithMessageHash(payloadHash, hexSig)) {
        return hexSig;
    }

    throw new InvalidTokenSignatureException();
}
