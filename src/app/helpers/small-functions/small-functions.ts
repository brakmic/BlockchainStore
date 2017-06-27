declare var CryptoJS: any;
const path = require('path');
// jsBase64 encoding/decoding
const jsBase64 = require('js-base64').Base64;
const _root = path.resolve(__dirname, '../../../../');
/**
 * A collection of small helper functions.
 */
class BCS {
  public static root = path.join.bind(path, _root);
  public static toBase64String(originalString: string): string {
    return jsBase64.encode(originalString);
  }
  public static encodeUri(originalUri: string): string {
    return jsBase64.encodeURI(originalUri);
  }
  public static decodeUri(base64Uri: string): string {
    return jsBase64.decodeURI(base64Uri);
  }
  public static fromBase64String(base64String: string): string {
    return jsBase64.decode(base64String);
  }
  public static generateID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = (d + Math.random() * 16 ) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8 )).toString(16);
    });
    return uuid;
  }
  public static generateHash(value, type = undefined): string {
        switch (type) {
            case 'sha1':
                return CryptoJS.SHA1(value);
            case 'sha2_256':
                return CryptoJS.SHA256(value);
            case 'sha2_512':
                return CryptoJS.SHA512(value);
            case 'sha3':
                return CryptoJS.SHA3(value);
            case 'md5':
                return CryptoJS.MD5(value);
            case 'ripemd160':
                return CryptoJS.RIPEMD160(value);
            default:
                return CryptoJS.SHA512(value);
        }
    }
  // ipad|ipod|blackberry
  public static isMobile(): boolean {
      const result = (/android|webos|iphone|windows phone/).
                        test(navigator.userAgent.toLowerCase());
      return result;
  }
  /**
   * Removes all unwanted / invalid chars from a string
   * @param  {string} original Original string
   * @return {string}          Sanitized string
   */
  public static sanitizeString(original: string): string {
    if (!original) return '';
    const unwantedChars = /([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&äöüÄÖÜß ])/gi;
    const defaultReplacement = '-';
    const replacements = {
        ' ': '-',
        '+': '-',
        '/': '-',
        '\\': '-',
        '%': '-',
        '$': '-',
        'ä': 'ae',
        'ü': 'ue',
        'ö': 'oe',
        'Ä': 'Ae',
        'Ö': 'Oe',
        'Ü': 'Ue',
        'ß': 'ss'
    };
    const replaceChar = (char: any): any => {
      const replaced = replacements[char] || defaultReplacement;
      return replaced;
    };

    const sanitizeString = (str: string): string => {
      return str.replace(unwantedChars, replaceChar);
    };

    return sanitizeString(original);
  }

}

export {
  BCS
};
