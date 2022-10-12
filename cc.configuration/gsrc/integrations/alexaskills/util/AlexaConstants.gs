package integrations.alexaskills.util

/**
 * author : aravind
 * date : 27 Sept 2022
 * desc : Constants class
 */
class AlexaConstants {

  final static var _alexaDBUser : String as ALEXA_DB_USER = "su"
  final static var _userToAssignActivity : String as USER_TO_ASSIGN_ACTIVITY = "su"
  final static var _fnolActivityPattern : String as FNOL_ACTIVITY_PATTERN = "alexa_fnol_notification"

  //Intents
  final static var _policyInfoIntent : String as POLICY_INFORMATION_INTENT = "policy_information"
  final static var _createClaimIntent : String as CREATE_CLAIM_INTENT = "create_claim"
  final static var _claimStatusIntent : String as CLAIM_STATUS_INTENT = "claim_status"
  final static var _claimNumberIntent : String as REFERENCE_NUMBER_INTENT = "reference_number"
  final static var _incidentDateIntent : String as INCIDENT_DATE_INTENT = "incident_date"
  final static var _incidentDescriptionIntent : String as INCIDENT_DESCRIPTION_INTENT = "incident_description"
  final static var _confirmationIntent : String as CONFIRMATION_INTENT = "confirmation"
  final static var _samePolicyNumber : String as SAME_POLICY_NUMBER_CONFIRMATION_INTENT = "same_policy_number"
  final static var _differentPolicyNumber : String as DIFFERENT_POLICY_NUMBER_CONFIRMATION_INTENT = "different_policy_number"
  final static var _intentRequestIntent : String as INTENT_REQUEST_INTENT = "IntentRequest"
  final static var _launchRequestIntent : String as LAUNCH_REQUEST_INTENT = "LaunchRequest"

  //Other constants
  final static var _endNote : String as END_NOTE = "END_NOTE"
  final static var _unhandledMessage : String as UNHANDLED_MESSAGE = "UNHANDLED_MESSAGE"
  final static var _invocationMessage : String as INVOCATION_MESSAGE = "INVOCATION_MESSAGE"
  final static var _unRecognizedSpeech : String as UNRECOGNIZED_SPEECH = "UNRECOGNIZED_SPEECH"
  final static var _thankyouNote : String as THANKYOU_NOTE = "THANKYOU_NOTE"
  final static var _diffPolicyNo : String as DIFFERENT_POLICY_NUMBER = "DIFFERENT_POLICY_NUMBER"
  final static var _samePolicyNo : String as SAME_POLICY_NUMBER = "SAME_POLICY_NUMBER"

  final static var allowedMasterSkills : List<String> as AllowedMasterSkills = {
      AlexaConstants.CREATE_CLAIM_INTENT,
      AlexaConstants.CLAIM_STATUS_INTENT,
      AlexaConstants.POLICY_INFORMATION_INTENT
  }

  final static var _say : Map<String, String> as SAY= {
      POLICY_INFORMATION_INTENT -> "Sure, What's your policy number ? ",
      CREATE_CLAIM_INTENT -> "Sure, What's your policy number ? ",
      CLAIM_STATUS_INTENT -> "Sure, Please help me with your claim number ? ",
      END_NOTE -> "Please let me know if you need any further assistance. ",
      UNHANDLED_MESSAGE -> "Sorry, I didn't get that. ",
      INVOCATION_MESSAGE -> "Hello, Welcome to Aravind Insurance. We can help you file a claim, know the status of your existing claim or your policy billing information. How would you like to proceed?",
      UNRECOGNIZED_SPEECH -> "Sorry, I didn't get that.",
      THANKYOU_NOTE -> "Thank you. Have a good day",
      DIFFERENT_POLICY_NUMBER -> "Okay, Please provide the policy number you need to continue with."
  }
}