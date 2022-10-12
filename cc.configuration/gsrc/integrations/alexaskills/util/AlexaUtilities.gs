package integrations.alexaskills.util

uses gw.date.Month

/**
 * author : Aravind
 * date : 15 Sept 2022
 * desc : Class to handle all the utilities
 */
class AlexaUtilities {

  /**
   * Function to spell the number
   * @param number
   * @return
   */
  static function spellNumber(number : String) : String {
    var result = ""
    foreach (n in number.split("")) {
      switch (n) {
        case "0":
          result += " Zero";
          break;
        case "1":
          result += " One";
          break;
        case "2":
          result += " Two";
          break;
        case "3":
          result += " Three";
          break;
        case "4":
          result += " Four";
          break;
        case "5":
          result += " Five";
          break;
        case "6":
          result += " Six";
          break;
        case "7":
          result += " Seven";
          break;
        case "8":
          result += " Eight";
          break;
        case "9":
          result += " Nine";
          break;
      }
    }
    return result
  }

  /**
   * Function to convert string Date to GW Date
   *
   * @param date
   * @return
   */
  static function getDate(date : String) : Date {
    var dateSplit = date.split("-")
    var month : Month
    var year = Integer.parseInt(dateSplit[0])
    var day = Integer.parseInt(dateSplit[2])
    switch (dateSplit[1]) {
      case "01":
      case "1":
        month = Month.JANUARY;
        break
      case "02":
      case "2":
        month = Month.FEBRUARY;
        break
      case "03":
      case "3":
        month = Month.MARCH;
        break
      case "04":
      case "4":
        month = Month.APRIL;
        break
      case "05":
      case "5":
        month = Month.MARCH;
        break
      case "06":
      case "6":
        month = Month.JUNE;
        break
      case "07":
      case "7":
        month = Month.JULY;
        break
      case "08":
      case "8":
        month = Month.AUGUST;
        break
      case "09":
      case "9":
        month = Month.SEPTEMBER;
        break
      case "10":
        month = Month.OCTOBER;
        break
      case "11":
        month = Month.NOVEMBER;
        break
      case "12":
        month = Month.DECEMBER;
        break
      default:
        throw new Exception("Invalid Month")
    }
    return Date.create(:year = year, :month = month, :day = day)
  }
}