import * as regex from 'regex'

describe('[regex]', () => {
  it('should match chinese characters', () => {
    expect(regex.chinese.test('中文')).toBeTruthy()
    expect(regex.chinese.test('中文简体繁體都可以')).toBeTruthy()
    expect(regex.chinese.test('abc')).toBeFalsy()
  })

  it('should match email address', () => {
    expect(regex.email.test('firstname.lastname@example.com')).toBeTruthy()
    expect(regex.email.test('firstname.lastname@com')).toBeFalsy()
    expect(regex.email.test('firstname.@example.com')).toBeFalsy()
  })

  it('should not match invalid password', () => {
    expect(regex.password.test('21342423423')).toBeFalsy()
    expect(regex.password.test('abCD@#$#@$@')).toBeFalsy()
    expect(regex.password.test('simplePassword')).toBeFalsy()
    expect(regex.password.test('less')).toBeFalsy()
  })

  it('should match valid password', () => {
    expect(regex.password.test('abCD23*^')).toBeTruthy()
    expect(regex.password.test('12CD!@cb')).toBeTruthy()
    expect(regex.password.test('&*23CDab')).toBeTruthy()
  })

  it('should match positive/negative integer', () => {
    expect(regex.integer.test('23423423423')).toBeTruthy()
    expect(regex.integer.test('-2342342883')).toBeTruthy()
    expect(regex.integer.test('23423fdsfsd')).toBeFalsy()
  })

  it('should match positive/negative number', () => {
    expect(regex.number.test('234234.23423')).toBeTruthy()
    expect(regex.number.test('-234234.23423')).toBeTruthy()
    expect(regex.number.test('234234.')).toBeFalsy()
    expect(regex.number.test('-234234.')).toBeFalsy()
  })

  it('should match valid URL (http/ftp/file)', () => {
    expect(regex.url.test('http://www.example.com')).toBeTruthy()
    expect(regex.url.test('https://www.example.com')).toBeTruthy()
    expect(regex.url.test('https://example.com')).toBeTruthy()
    expect(regex.url.test('example.it')).toBeTruthy()
    expect(regex.url.test('ftp://www.example.com')).toBeTruthy()
    expect(regex.url.test('ftp://example.it')).toBeTruthy()
  })

  it('should match valid IP (v4) address', () => {
    expect(regex.ipv4.test('8.8.8.8')).toBeTruthy()
    expect(regex.ipv4.test('255.255.255.0')).toBeTruthy()
    expect(regex.ipv4.test('256.255.255.0')).toBeFalsy()
  })
})
