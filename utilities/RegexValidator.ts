import { FaLessThanEqual } from "react-icons/fa";

class RegexValidator {
  static validatePhone = (phone: string) => {
    if (phone.length === 0)
      return { isCheck: false, error: "درج شماره موبایل ضروری است!!" };
    return {
      isCheck: Pattern.phoneRegex.test(phone),
      error: Pattern.phoneRegex.test(phone) ? "" : "شماره موبایل صحیح نیست!!",
    };
  };

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

  static validateCode(code: string) {
    if (code.length === 0) return false;
    return code.length === 5;
  }
}

class Pattern {
  static phoneRegex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
}

export default RegexValidator;
