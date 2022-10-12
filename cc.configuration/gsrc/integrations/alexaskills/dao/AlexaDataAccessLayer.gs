package integrations.alexaskills.dao

uses gw.api.database.Query
uses org.apache.log4j.Logger
uses jsonschema.alexaskills.Request.v1_0.Session
uses integrations.alexaskills.util.AlexaConstants
uses integrations.alexaskills.dto.PolicyInfoDTO


/**
 * author : Aravind
 * date : 15 Sept 2022
 * Class to handle all DB related operations for the ALEXA request
 * Whenever a new request comes, the necessary info will be kept in DB for further processing
 */
class AlexaDataAccessLayer {

  var isNewRequest : boolean as IsNewRequest = false
  private var _alexaDBRecord : AlexaRequestBook as AlexaDBRecord
  private static final var _logger = Logger.getLogger(AlexaDataAccessLayer)
  private var _dbUser = AlexaConstants.ALEXA_DB_USER

  construct(session : Session, requestName : String){
    _alexaDBRecord = createRecordIfNotExist(session)
    updateSkillRequestIfNew(requestName)
  }

  /**
   * Function to save or retrieve record
   *
   * @param polNumber
   * @param incidentDate
   * @param description
   * @return
   */
  function updateRecord(incidentDate : Date = null,
                        description : String = null,
                        claimNumber: String = null,
                        policyFileDTO : PolicyInfoDTO = null) : AlexaRequestBook {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _alexaDBRecord = bundle.add(_alexaDBRecord)
      if (incidentDate != null) {
        _alexaDBRecord.IncidentDate = incidentDate
      }
      if (description != null) {
        _alexaDBRecord.ClaimDescription = description
      }
      if (claimNumber != null) {
        _alexaDBRecord.ClaimNumber = claimNumber
      }
      if(policyFileDTO != null){
        _alexaDBRecord.PolicyNumber = policyFileDTO.PolicyNumber
        _alexaDBRecord.PolicyStartDate = policyFileDTO.EffectiveDate
        _alexaDBRecord.PolicyEndDate = policyFileDTO.ExpirationDate
        _alexaDBRecord.PolicyType = policyFileDTO.PolicyType
      }
    }, _dbUser)
    return _alexaDBRecord
  }


  /**
   * Function to create DB record if not exists
   *
   * @param session
   * @return
   */
  private function createRecordIfNotExist(session : Session) : AlexaRequestBook {
    var userID = session.user.userId
    var sessionID = session.sessionId
    var applicationID = session.application.applicationId
    _logger.info("------REQUEST DETAILS-----------------------------------------------------------")
    _logger.info("User ID is :" + userID)
    _logger.info("Session ID is :" + sessionID)
    _logger.info("Application ID is :" + applicationID)
    _logger.info("--------------------------------------------------------------------------------")

    var record = Query.make(AlexaRequestBook)
        .compare(AlexaRequestBook#AlexaUserID, Equals, userID)
        .compare(AlexaRequestBook#AlexaSessionID, Equals, sessionID)
        .compare(AlexaRequestBook#AlexaApplicationID, Equals, applicationID)
        .select().AtMostOneRow


    IsNewRequest = false
    if (record == null) {
      IsNewRequest = true
      _logger.info("No Exisitng Record Found. Hence creating a new one")
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        record = bundle.add(new AlexaRequestBook())
        record.AlexaUserID = userID
        record.AlexaSessionID = sessionID
        record.AlexaApplicationID = applicationID
      }, _dbUser)
    }

    return record
  }

  /**
   * Function to update the skill
   * @param request
   */
  private function updateSkillRequestIfNew(request : String){
    if(AlexaConstants.AllowedMasterSkills.contains(request)) {
      _logger.info("New request. Request is : "+request)
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        bundle.add(_alexaDBRecord).SkillName = request
      }, _dbUser)
    }
  }

}