class RegexValidator {
  static validatePhone(phone: string) {
    if (phone.length === 0) return false;
    return Paterns.phoneRegex.test(phone);
  }

  static validatePassword(password: string) {
    if (password.length === 0) return false;
    return password.length >= 8 && password.length <= 16;
  }

  static validateVerificationCode(code: string) {
    if (code.length === 0) return false;
    return code.length === 6;
  }

  static validateName(name: string) {
    if (name.length === 0) return false;
    return name.length >= 3;
  }
}

class Paterns {
  static phoneRegex = RegExp(
    /(^(\+98|98|0|0098)9\d{9}$)|(^(\+\u0669\u0668|\u0669\u0668|\u0660|\u0660\u0660\u0669\u0668)\u0669[\u0660-\u0669]{9}$)|(^(\+\u06f9\u06f8|\u06f9\u06f8|\u06f0|\u06f0\u06f0\u06f9\u06f8)\u06f9[\u06f0-\u06f9]{9}$)/
  );
}

export default RegexValidator;
