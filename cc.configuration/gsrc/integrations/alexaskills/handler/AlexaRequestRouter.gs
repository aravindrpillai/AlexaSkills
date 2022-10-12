package integrations.alexaskills.handler

uses gw.api.database.Query
uses org.apache.log4j.Logger
uses integrations.alexaskills.util.ActivityUtil
uses jsonschema.alexaskills.Request.v1_0.Request
uses integrations.alexaskills.util.AlexaConstants
uses integrations.alexaskills.util.AlexaUtilities
uses integrations.alexaskills.dto.FNOLResponseDTO
uses integrations.alexaskills.dao.AlexaDataAccessLayer

/**
 * author : Aravind
 * date : 21 Sept 2022
 * Class to handle the FNOL creation Requests
 */
class AlexaRequestRouter {

  private var _dao : AlexaDataAccessLayer
  static final var _logger = Logger.getLogger(AlexaRequestRouter)

  /**
   * init method
   * @param requestDTO
   */
  private function init(requestDTO : Request){
    var requestName = requestDTO?.request?.intent?.name
    _dao = new AlexaDataAccessLayer(requestDTO.session, requestName)
  }

  /**
   * Function to route the request
   * @param requestDTO
   * @return
   */
  function handleRequst(requestDTO : Request) : FNOLResponseDTO{
    var say = ""
    init(requestDTO)
    _logger.info("Intent Received : "+requestDTO?.request?.intent?.name)

    switch(requestDTO?.request?.intent?.name){

      case AlexaConstants.POLICY_INFORMATION_INTENT:
        say = AlexaConstants.SAY.get(AlexaConstants.POLICY_INFORMATION_INTENT)
        break
      case AlexaConstants.CREATE_CLAIM_INTENT:
        if(_dao.AlexaDBRecord.PolicyNumber != null){
          say = "Do you want to file this claim on policy with policy number "+AlexaUtilities.spellNumber(_dao.AlexaDBRecord.PolicyNumber)+" or on a different policy?"
        }else{
          say = AlexaConstants.SAY.get(AlexaConstants.CREATE_CLAIM_INTENT)
        }
        break
      case AlexaConstants.CLAIM_STATUS_INTENT:
        say = AlexaConstants.SAY.get(AlexaConstants.CLAIM_STATUS_INTENT)
        break


      case AlexaConstants.REFERENCE_NUMBER_INTENT:
        var referenceNumber = requestDTO?.request?.intent?.slots?.referenceNumber?.value
        _logger.info("Parent Intent is "+_dao.AlexaDBRecord.SkillName+" | Reference Number is : "+referenceNumber)
        switch(_dao.AlexaDBRecord.SkillName){
          case AlexaConstants.CREATE_CLAIM_INTENT:
            say = handlerPolicyNumberInputForFNOLCreation(referenceNumber)
            break
          case AlexaConstants.CLAIM_STATUS_INTENT:
            say = handleRequestClaimStatusResponse(referenceNumber)
            break
          case AlexaConstants.POLICY_INFORMATION_INTENT:
            say = handlerPolicyNumberInputForPolicyInformation(referenceNumber)
            break
          default:
            throw new Exception("Invalid parent skill")
        }
        break

      case AlexaConstants.INCIDENT_DATE_INTENT:
        var date = requestDTO?.request?.intent?.slots?.incidentDate?.value
        say = handleIncidentDateInput(date)
        break
      case AlexaConstants.SAME_POLICY_NUMBER_CONFIRMATION_INTENT:
        say = handlerPolicyNumberInputForFNOLCreation(_dao.AlexaDBRecord.PolicyNumber)
        break
      case AlexaConstants.DIFFERENT_POLICY_NUMBER_CONFIRMATION_INTENT:
        say = AlexaConstants.SAY.get(AlexaConstants.DIFFERENT_POLICY_NUMBER)
        break
      case AlexaConstants.INCIDENT_DESCRIPTION_INTENT:
        var description = requestDTO?.request?.intent?.slots?.incidentDescription?.value
        handlerIncidentDescriptionInput(description)
        say = createFNOL()
        ActivityUtil.createFNOLActivity(_dao.AlexaDBRecord.ClaimNumber)
        break
      case AlexaConstants.CONFIRMATION_INTENT:
        say = AlexaConstants.SAY.get(AlexaConstants.THANKYOU_NOTE)
        break
      default:
        if(_dao.IsNewRequest) {
          if (requestDTO?.request?.type == AlexaConstants.INTENT_REQUEST_INTENT || requestDTO?.request?.type == AlexaConstants.LAUNCH_REQUEST_INTENT) {
            say = AlexaConstants.SAY.get(AlexaConstants.INVOCATION_MESSAGE)
          } else {
            say = AlexaConstants.SAY.get(AlexaConstants.UNHANDLED_MESSAGE)
          }
        }else{
          say = AlexaConstants.SAY.get(AlexaConstants.UNRECOGNIZED_SPEECH)
        }
    }
    return new FNOLResponseDTO(say)
  }



  /**
   * Function to handle Incident Date
   * @param date
   * @return
   */
  private function handleIncidentDateInput(date : String) : String {
    try {
      var parsedDate = AlexaUtilities.getDate(date)
      _logger.debug("Parsed Date : "+parsedDate.toString())
      _dao.updateRecord(:incidentDate = parsedDate)
      return "Noted! Please summarise what happened?";
    } catch (e) {
      _logger.error(e.StackTraceAsString)
      return "Sorry! I didn't get that. Please tell me when did the incident happen?";
    }
  }

  /**
   * Function to handle Policy Number Input
   * @param policyNumber
   * @return
   */
  private function handlerPolicyNumberInputForFNOLCreation(policyNumber : String) : String {
    _logger.info("Policy Number received : "+policyNumber)
    var policyResponse = new PolicyHandler().validatePolicy(policyNumber)
    if(policyResponse.CanProceed){
      _dao.updateRecord(:policyFileDTO = policyResponse)
      return "Perfect. Please tell me when did the incident happen?"
    }else{
      var spellPolNumber = AlexaUtilities.spellNumber(policyNumber)
      return "Sorry. There are no active polices found with policy number "+spellPolNumber+". Please provide the correct number"
    }
  }

  /**
   * Function to handle Policy Number Input
   * @param policyNumber
   * @return
   */
  private function handlerPolicyNumberInputForPolicyInformation(policyNumber : String) : String {
    _logger.info("Policy Number received : "+policyNumber)
    var policyResponse = new PolicyHandler().getPolicyInfo(policyNumber)
    if(policyResponse.CanProceed){
      _dao.updateRecord(:policyFileDTO = policyResponse)
      var op = "This policy is in "+policyResponse.Status+" status"
      if(policyResponse.Status == "inforce"){
        op += " and will expire on "+policyResponse.ExpirationDate+". "
      }else{
        op += " and is expired on "+policyResponse.ExpirationDate+". "
      }
      op += " There is an outstanding amount of "+policyResponse.TotalOutstandingAmount+" pounds on this policy, "
      op += "and the due date is "+policyResponse.NextInvoicesDueDate+". "

      return op + AlexaConstants.SAY.get(AlexaConstants.END_NOTE)
    }else{
      var spellPolNumber = AlexaUtilities.spellNumber(policyNumber)
      return "Sorry. I could not find any policy with number "+spellPolNumber+". Please provide the correct number"
    }
  }

  /**
   * Function to handle Policy Number Input
   * @param policyNumber
   * @return
   */
  private function handlerIncidentDescriptionInput(description : String) : String {
    _logger.info("Incident Description : "+description)
    _dao.updateRecord(:description = description)
    return "Saved"
  }

  /**
   * Function to file the FNOL
   * Data will be pulled from the _dao Layer
   * @return
   */
  private function createFNOL() : String {
    var policyNumber = _dao.AlexaDBRecord.PolicyNumber
    var description = _dao.AlexaDBRecord.ClaimDescription
    var incidentDate = _dao.AlexaDBRecord.IncidentDate
    try {
      var claimNumber = new CreateFNOL().create(policyNumber, description, incidentDate)
      _dao.updateRecord(:claimNumber = claimNumber)
      _logger.info("FNOL Filed successfully - Claim Number :"+claimNumber)
      var sayClaim = "We have filed your claim successfully. Your claim number is " + AlexaUtilities.spellNumber(claimNumber)
      return sayClaim + ". " + AlexaConstants.SAY.get("END_NOTE")
    }catch(e){
      _logger.error(e.StackTraceAsString)
      return "Failed to create claim. Please try again."
    }
  }

  /**
   * Function to handle claim status
   * @return
   */
  private function handleRequestClaimStatusResponse(claimNumber : String ) : String {
    _logger.info("Claim Number Received is : " +claimNumber)
    var claim = Query.make(Claim).compare(Claim#ClaimNumber, Equals, claimNumber).select().AtMostOneRow
    if(claim == null){
      return "Sorry, Claim with number "+AlexaUtilities.spellNumber(claimNumber) +" is not found. Please provide the correct number."
    }
    return "You have filed the claim on "+claim.CreateTime+" and its in "+claim.State.Description +" state. "+ AlexaConstants.SAY.get("END_NOTE")
  }




}