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
}

class Pattern {
  static phoneRegex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
}

export default RegexValidator;
