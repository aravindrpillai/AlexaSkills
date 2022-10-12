package integrations.alexaskills.handler

uses org.apache.log4j.Logger
uses integrations.alexaskills.dto.PolicyInfoDTO
uses integrations.alexaskills.wsc.pc.alexabillinginfo.AlexaBillingInfo
uses wsi.remote.gw.webservice.pc.pc1000.entities.types.complex.CCPCSearchCriteria
uses wsi.remote.gw.webservice.pc.pc1000.ccpolicysearchintegration.CCPolicySearchIntegration

/**
 * author : Aravind
 * date : 21 Sept 2022
 * Class to handle PC integrations
 *
 */
class PolicyHandler {

  static final var _logger = Logger.getLogger(PolicyHandler)

  /**
   * Function to validate policy and get the necessary information
   * @param policyNumber
   * @return
   */
  function validatePolicy(policyNumber : String) : PolicyInfoDTO{
    _logger.info("Starting to communicate to PC for policy information")
    var api = new CCPolicySearchIntegration()
    var request = getRequest(policyNumber)
    var resp = api.searchForPolicies(request, null)
    var data = resp.firstWhere(\elt -> elt.Status == "inforce")
    if(data == null){
      _logger.info("No Active Policy Found")
    }
    return (data == null) ? new PolicyInfoDTO() : new PolicyInfoDTO(data)
  }

  /**
   * Function to validate policy and get the necessary information
   * BC info WS is routed through PC | this can be wired directly to BC for performance optimization
   * @param policyNumber
   * @return
   */
  function getPolicyInfo(policyNumber : String) : PolicyInfoDTO{
    _logger.info("Starting to communicate to PC for policy information")
    var policyAPI = new CCPolicySearchIntegration()
    var request = getRequest(policyNumber)
    var data = policyAPI.searchForPolicies(request, null)?.last()
    if(data == null){
      _logger.info("No Policy Found")
      return new PolicyInfoDTO()
    }

    //billing information
    var billingAPI = new AlexaBillingInfo()
    var billingInfo = billingAPI.getBillingInformation(policyNumber)

    return new PolicyInfoDTO(data, billingInfo)
  }

  /**
   * function to create the request
   * @param policyNumber
   * @return
   */
  private function getRequest(policyNumber : String) : CCPCSearchCriteria{
    var request = new CCPCSearchCriteria()
    request.PolicyNumber = policyNumber
    return request
  }

}