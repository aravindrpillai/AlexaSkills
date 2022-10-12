package alexaskills

uses gw.plugin.Plugins
uses gw.api.database.Query
uses org.apache.log4j.Logger
uses gw.xml.ws.annotation.WsiWebService
uses gw.plugin.billing.IBillingSummaryPlugin
uses gw.plugin.billing.impl.StandAloneBillingSummaryPlugin

/**
 * author : aravind
 * date : 26 Sept 2022
 * Class to handle billing info request from claimcenter
 */
@WsiWebService
class AlexaBillingInfo {

  static final var _logger = Logger.getLogger(AlexaBillingInfo)

  /**
   * Function to get the billing information for alexa
   * @param policyNumber
   * @return
   */
  function getBillingInformation(policyNumber : String) : AlexaBillingResponseDTO {
    _logger.info("Getting billing information for policy number : " + policyNumber)
    var responseDTO = new AlexaBillingResponseDTO()
    try {
      var account = Query.make(PolicyPeriod)
          .compare(PolicyPeriod#PolicyNumber, Equals, policyNumber)
          .select()?.first()?.Policy.Account
      if (account == null) {
        throw new Exception("Policy not found")
      }
      var accountNumber = account.AccountNumber
      print("Account Number : " + accountNumber)
      var api = Plugins.get(IBillingSummaryPlugin)
      var billingInfo = api.retrieveAccountBillingSummaries(accountNumber)?.first()
      responseDTO.TotalPaid = billingInfo.Paid
      responseDTO.NextInvoicesDueDate = billingInfo.NextInvoicesDueDate
      responseDTO.NextInvoicesDueAmount = billingInfo.NextInvoicesDue?.first()?.Amount
      responseDTO.TotalOutstandingAmount = billingInfo.BilledOutstandingTotal?.Amount
      responseDTO.AccountNumber = accountNumber
    } catch (e : Exception) {
      responseDTO.Status = false
      responseDTO.Message = "no policy found"
    }
    return responseDTO
  }
}