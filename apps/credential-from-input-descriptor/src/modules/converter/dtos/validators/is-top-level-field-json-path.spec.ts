import { IsTopLevelFieldJsonPathConstraint } from './is-top-level-field-json-path';

describe(IsTopLevelFieldJsonPathConstraint.name, function () {
  let instance: IsTopLevelFieldJsonPathConstraint;

  beforeEach(async function () {
    instance = new IsTopLevelFieldJsonPathConstraint();
  });

  it('should be defined', function () {
    expect(instance).toBeDefined();
  });

  it('should reject not string values', function () {
    expect(instance.validate({})).toBe(false);
    expect(instance.validate([])).toBe(false);
    expect(instance.validate(null)).toBe(false);
    expect(instance.validate(undefined)).toBe(false);
  });

  it('should reject not JSON path string', function () {
    expect(instance.validate('foobar')).toBe(false);
    expect(instance.validate('sdf.foobar')).toBe(false);
    expect(instance.validate('$.')).toBe(false);
  });

  it('should accept top-level JSON path string', function () {
    expect(instance.validate('$.fieldName')).toBe(true);
  });

  it('should reject 2nd and more level path string', function () {
    expect(instance.validate('$.first.second')).toBe(false);
    expect(instance.validate('$.first.second.third')).toBe(false);
    expect(instance.validate('$.first.second.third.fourth')).toBe(false);
  });
});
