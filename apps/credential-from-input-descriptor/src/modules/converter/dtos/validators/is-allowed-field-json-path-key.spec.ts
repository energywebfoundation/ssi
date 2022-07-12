import { IsAllowedFieldJsonPathKeyConstraint } from './is-allowed-field-json-path-key';

describe(IsAllowedFieldJsonPathKeyConstraint.name, function () {
  let instance: IsAllowedFieldJsonPathKeyConstraint;
  beforeEach(async function () {
    instance = new IsAllowedFieldJsonPathKeyConstraint();
  });

  it('should be defined', function () {
    expect(instance).toBeDefined();
  });

  it('should accept allowed values', function () {
    expect(instance.validate('$.@context')).toBe(true);
    expect(instance.validate('$.credentialSubject')).toBe(true);
    expect(instance.validate('$.id')).toBe(true);
    expect(instance.validate('$.issuanceDate')).toBe(true);
    expect(instance.validate('$.issuer')).toBe(true);
    expect(instance.validate('$.proof')).toBe(true);
    expect(instance.validate('$.type')).toBe(true);
  });

  it('should reject not allowed values', function () {
    expect(instance.validate('$')).toBe(false);
    expect(instance.validate('$.')).toBe(false);
    expect(instance.validate('$.foobar')).toBe(false);
    expect(instance.validate('$.id.')).toBe(false);
    expect(instance.validate('$.id.issuer')).toBe(false);
  });
});
