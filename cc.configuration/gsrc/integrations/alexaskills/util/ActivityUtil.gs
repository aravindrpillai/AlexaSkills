package integrations.alexaskills.util

uses gw.api.database.Query
uses org.apache.log4j.Logger

/**
 * author : Aravind
 * date : 27 Sept 2022
 * Class to handle activities
 */
class ActivityUtil {

  static final var _logger = Logger.getLogger(ActivityUtil)

  /**
   * Function to create the FNOL activity
   */
  static function createFNOLActivity(claimNumber : String) {
    _logger.info("Starting to create activity for claim : " + claimNumber)
    var pattern = retrieveOrCreateActivityPattern()
    var activity : Activity

    var credential = Query.make(Credential)
        .compare(Credential#UserName, Equals, AlexaConstants.USER_TO_ASSIGN_ACTIVITY)
        .select().AtMostOneRow
    var user = Query.make(User)
        .compare(User#Credential, Equals, credential)
        .select().AtMostOneRow

    var claim = Query.make(Claim).compare(Claim#ClaimNumber, Equals, claimNumber).select().AtMostOneRow

    try {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        activity = bundle.add(new Activity())
        activity.ActivityPattern = pattern
        activity.Claim = claim
        activity.Description = pattern.Description
        activity.Subject = pattern.Subject
        activity.ShortSubject = "Alexa FNOL"
        activity.Approved = true
        activity.TargetDate = Date.CurrentDate.addBusinessDays(1)
        activity.EscalationDate = Date.CurrentDate.addBusinessDays(2)
        activity.Priority = Priority.TC_NORMAL
        activity.Importance = pattern.Importance
        activity.assign(user.getRootGroup(), user)

      }, AlexaConstants.ALEXA_DB_USER)
      _logger.info("Activity created successfully")
    } catch (e : Exception) {
      _logger.error("Failed to create activity")
      _logger.error(e.StackTraceAsString)
    }
  }

  /**
   * Function to create or retrieve activity pattern
   * New Pattern will be created if not exists
   *
   * @return
   */
  private static function retrieveOrCreateActivityPattern() : ActivityPattern {
    var patternCode = AlexaConstants.FNOL_ACTIVITY_PATTERN
    var pattern = Query.make(ActivityPattern)
        .compare(ActivityPattern#Code, Equals, patternCode)
        .select().AtMostOneRow
    if (pattern == null) {
      _logger.info("Creating activity pattern")
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        pattern = bundle.add(new ActivityPattern())
        pattern.Category = ActivityCategory.TC_REMINDER
        pattern.Code = patternCode
        pattern.ActivityClass = ActivityClass.TC_EVENT
        pattern.Mandatory = true
        pattern.AutomatedOnly = true
        pattern.Subject = "New FNOL Request from Alexa"
        pattern.Description = "FNOL Created from Alexa Skill"
        pattern.Priority = Priority.TC_NORMAL
        pattern.EscalationDays = 3
        pattern.PublicID = "Act:1001001"
        pattern.Importance = ImportanceLevel.TC_HIGH
      }, AlexaConstants.ALEXA_DB_USER)
    }
    _logger.debug("Pattern : " + pattern.Code)
    return pattern
  }

}