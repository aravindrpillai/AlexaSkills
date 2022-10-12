package integrations.alexaskills.handler

uses gw.webservice.cc.cc1000.dto.ClaimDTO
uses gw.webservice.cc.cc1000.dto.PolicyDTO

/**
 * author : Aravind
 * date : 15 Sept 2022
 * desc : Class to create the FNOL
 */
class CreateFNOL {

  /**
   * Function to create the FNOL
   * @param policyNumber
   * @param desc
   * @param lossDate
   * @return
   */
  function create(policyNumber : String, desc : String, lossDate : Date) : String {
    var claimDTO = new ClaimDTO()
    var policyDTO = new PolicyDTO()

    policyDTO.PolicyType = PolicyType.TC_BUSINESSAUTO
    claimDTO.LossType = getLossType(policyDTO.PolicyType)

    policyDTO.PolicyNumber = policyNumber
    claimDTO.Description = desc
    claimDTO.LossDate = lossDate

    var api = new gw.webservice.cc.cc1000.claim.ClaimAPI()
    var output = api.addFNOL(claimDTO, policyDTO)
    var cNo = gw.api.database.Query.make(Claim).compare(Claim#PublicID, Equals, output).select()?.FirstResult?.ClaimNumber
    return cNo
  }


  /**
   * Function to get the loss type
   * @param policyType
   * @return
   */
  private function getLossType(policyType : PolicyType) : LossType {
    switch (policyType) {
      case PolicyType.TC_BUSINESSAUTO:
      case PolicyType.TC_PERSONALAUTO:
        return LossType.TC_AUTO
      case PolicyType.TC_GENERALLIABILITY:
        return LossType.TC_GL
      case PolicyType.TC_COMMERCIALPROPERTY:
        return LossType.TC_PR
      case PolicyType.TC_TRAVEL_PER:
        return LossType.TC_TRAV
      case PolicyType.TC_WORKERSCOMP:
        return LossType.TC_WC
      default:
        throw new Exception("Invalid Policy Type")
    }
  }

}