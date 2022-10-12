package alexaskills

uses java.math.BigDecimal
uses gw.xml.ws.annotation.WsiExportable

/**
 * author : Aravind
 * date : 26 Sept 2022
 * desc : DTO class to hold billing information
 */
@WsiExportable
final class AlexaBillingResponseDTO {

  var status : boolean as Status = true
  var message : String as Message = null

  var totalPaid : BigDecimal as TotalPaid
  var nextInvoicesDueDate : Date as NextInvoicesDueDate
  var nextInvoicesDueAmount : BigDecimal as NextInvoicesDueAmount
  var totalOutstandingAmount : BigDecimal as TotalOutstandingAmount
  var accountNumber : String as AccountNumber

}