package integrations.alexaskills

uses gw.api.json.JsonObject
uses org.apache.log4j.Logger
uses gw.api.json.JsonConfigAccess
uses gw.api.json.mapping.TransformResult
uses jsonschema.alexaskills.Request.v1_0.Request
uses integrations.alexaskills.handler.AlexaRequestRouter

/**
 * author : Aravind
 * date : 15 Sept 2022
 * desc : Alexa skill handler class.
 */
class AlexaSkillsHandler {

  static final var _logger = Logger.getLogger(AlexaSkillsHandler)

  /**
   * control comes here from Alexa skills
   * @param body
   * @return
   */
  function claimsHandler(body : JsonObject) : TransformResult {
    _logger.info("Starting Claim Process - FNOL Creation")
    var requestDTO = Request.wrap(body)
    var response = new AlexaRequestRouter().handleRequst(requestDTO)
    var jsonResponseMapper = JsonConfigAccess.getMapper("alexaskills.Response-1.0", "Response")
    _logger.info("done processing rest service request. sending response..")
    return jsonResponseMapper.transformObject(response)
  }

}