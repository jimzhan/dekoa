import * as regex from 'regex'
import { expect } from 'chai'

describe('[regex]', () => {
  describe('[chinese]', () => {
    it('should match chinese characters', () => {
      /* eslint-disable */
      expect(regex.chinese.test('中文')).to.be.true;
      expect(regex.chinese.test('中文简体繁體都可以')).to.be.true;
      expect(regex.chinese.test('abc')).to.be.false;
      /* eslint-enable */
    })
  })

  describe('[email]', () => {
    it('should match email address', () => {
      /* eslint-disable */
      expect(regex.email.test('firstname.lastname@example.com')).to.be.true;
      expect(regex.email.test('firstname.lastname@com')).to.be.false;
      expect(regex.email.test('firstname.@example.com')).to.be.false;
      /* eslint-enable */
    })
  })

  describe('[password]', () => {
    it('should not match invalid password', () => {
      /* eslint-disable */
      expect(regex.password.test('21342423423')).to.be.false;
      expect(regex.password.test('abCD@#$#@$@')).to.be.false;
      expect(regex.password.test('simplePassword')).to.be.false;
      expect(regex.password.test('less')).to.be.false;
      /* eslint-enable */
    })

    it('should match valid password', () => {
      /* eslint-disable */
      expect(regex.password.test('abCD23*^')).to.be.true;
      expect(regex.password.test('12CD!@cb')).to.be.true;
      expect(regex.password.test('&*23CDab')).to.be.true;
      /* eslint-enable */
    })
  })

  describe('[integer]', () => {
    it('should match positive/negative integer', () => {
      /* eslint-disable */
      expect(regex.integer.test('23423423423')).to.be.true;
      expect(regex.integer.test('-2342342883')).to.be.true;
      expect(regex.integer.test('23423fdsfsd')).to.be.false;
      /* eslint-enable */
    })
  })

  describe('[number]', () => {
    it('should match positive/negative number', () => {
      /* eslint-disable */
      expect(regex.number.test('234234.23423')).to.be.true;
      expect(regex.number.test('-234234.23423')).to.be.true;
      expect(regex.number.test('234234.')).to.be.false;
      expect(regex.number.test('-234234.')).to.be.false;
      /* eslint-enable */
    })
  })

  describe('[url]', () => {
    it('should match valid URL (http/ftp/file)', () => {
      /* eslint-disable */
      expect(regex.url.test('http://www.example.com')).to.be.true;
      expect(regex.url.test('https://www.example.com')).to.be.true;
      expect(regex.url.test('https://example.com')).to.be.true;
      expect(regex.url.test('example.it')).to.be.true;
      expect(regex.url.test('ftp://www.example.com')).to.be.true;
      expect(regex.url.test('ftp://example.it')).to.be.true;
      /* eslint-enable */
    })
  })

  describe('[IP]', () => {
    it('should match valid IP (v4) address', () => {
      /* eslint-disable */
      expect(regex.ipv4.test('8.8.8.8')).to.be.true;
      expect(regex.ipv4.test('255.255.255.0')).to.be.true;
      expect(regex.ipv4.test('256.255.255.0')).to.be.false;
      /* eslint-enable */
    })
  })
})
