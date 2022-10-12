package integrations.alexaskills.dto

uses gherkin.deps.com.google.gson.annotations.SerializedName

/**
 * author : Aravind
 * date   : 08 Sept 2022
 * desc   : DTO class for Response DTO
 */
class FNOLResponseDTO {

  private construct(){}

  construct(speech : String){
    Version = "1.0"
    Response = new ResponseDTO()
    Response.ShouldEndSession = false
    Response.Type = "_DEFAULT_RESPONSE"
    Response.OutputSpeech = new OutputSpeechDTO()
    Response.OutputSpeech.Type = "SSML"
    Response.OutputSpeech.Ssml = "<speak>"+speech+"</speak>"
    SessionAttributes = new SessionAttributesDTO(){ :Locale = "en-GB" }
    UserAgent = "ask-node/2.0.7 Node/v10.24.1"
  }

  @SerializedName("version")
  var _version : String as Version

  @SerializedName("response")
  var _response : ResponseDTO as Response

  @SerializedName("sessionAttributes")
  var _sessionAttributes : SessionAttributesDTO as SessionAttributes

  @SerializedName("userAgent")
  var _userAgent : String as UserAgent


  /**
   * Output Speech |  Inner class
   */
  class ResponseDTO {

    @SerializedName("outputSpeech")
    var _outputSpeech : OutputSpeechDTO as OutputSpeech

    @SerializedName("shouldEndSession")
    var _shouldEndSession : boolean as ShouldEndSession

    @SerializedName("type")
    var _type : String as Type

  }

  /**
   * Output Speech |  Inner class
   */
  class SessionAttributesDTO {

    @SerializedName("locale")
    var _locale : String as Locale

  }

  /**
   * Output Speech | Inner class
   */
  class OutputSpeechDTO {

    @SerializedName("type")
    var _type : String as Type

    @SerializedName("ssml")
    var _ssml : String as Ssml

  }

}