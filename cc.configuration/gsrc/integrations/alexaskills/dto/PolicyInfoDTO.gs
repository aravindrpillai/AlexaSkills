package integrations.alexaskills.dto

uses java.math.BigDecimal
uses wsi.remote.gw.webservice.pc.pc1000.entities.types.complex.CCPolicySummary
uses integrations.alexaskills.wsc.pc.alexabillinginfo.types.complex.AlexaBillingResponseDTO


/**
 * DTO class to keep the necessary informations of Policy
 */
class PolicyInfoDTO {

  construct(pol : CCPolicySummary, bill : AlexaBillingResponseDTO) {
    //PolicyInformation
    PolicyNumber = pol.PolicyNumber
    EffectiveDate = pol.EffectiveDate
    ExpirationDate = pol.ExpirationDate
    Status = pol.Status
    PolicyType = pol.PolicyType
    InsuredName = pol.InsuredName

    //Status
    CanProceed = bill.Status
    Message = bill.Message

    //Billing Information
    TotalPaid = bill.TotalPaid
    NextInvoicesDueDate = bill.NextInvoicesDueDate
    NextInvoicesDueAmount = bill.NextInvoicesDueAmount
    TotalOutstandingAmount = bill.TotalOutstandingAmount
    AccountNumber = bill.AccountNumber

  }

  construct(pol : CCPolicySummary) {
    //PolicyInformation
    PolicyNumber = pol.PolicyNumber
    EffectiveDate = pol.EffectiveDate
    ExpirationDate = pol.ExpirationDate
    Status = pol.Status
    PolicyType = pol.PolicyType
    InsuredName = pol.InsuredName
  }

  construct() {
    CanProceed = false
    Message = "Policy Not Found"
  }

  var _policyNumber : String as PolicyNumber
  var _effectiveDate : Date as EffectiveDate
  var _expirationDate : Date as ExpirationDate
  var _status : String as Status
  var _policyType : String as PolicyType
  var _insuredName : String as InsuredName

  //Below 2 fields keep the service errors if any
  var _canProceed : boolean as CanProceed = true
  var _message : String as Message = null

  //Billing Information
  var totalPaid : BigDecimal as TotalPaid
  var nextInvoicesDueDate : Date as NextInvoicesDueDate
  var nextInvoicesDueAmount : BigDecimal as NextInvoicesDueAmount
  var totalOutstandingAmount : BigDecimal as TotalOutstandingAmount
  var accountNumber : String as AccountNumber
}