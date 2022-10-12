package integrations.alexaskills.auth

uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.AuthenticationSourceCreatorPlugin

uses javax.servlet.http.HttpServletRequest

class RestAuthenticationSourceCreationPlugin implements AuthenticationSourceCreatorPlugin {

  override function createSourceFromHTTPRequest(request : HttpServletRequest) : AuthenticationSource {
    var s = new RestAuthenticationSource()
    s.Username = "su"
    s.Password = "gw"
    return s
  }
}