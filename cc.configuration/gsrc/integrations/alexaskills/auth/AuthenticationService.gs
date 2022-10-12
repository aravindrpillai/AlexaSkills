package integrations.alexaskills.auth

uses gw.api.database.Query
uses gw.plugin.security.AuthenticationServicePluginCallbackHandler
uses gw.plugin.security.AuthenticationSource

class AuthenticationService implements gw.plugin.security.AuthenticationServicePlugin {

  override function authenticate(source : AuthenticationSource) : String {
    var suCred = Query.make(Credential).compare(Credential#UserName, Equals, "su").select().AtMostOneRow
    var user = Query.make(User).compare(User#Credential, Equals, suCred).select().AtMostOneRow
    print("Bypassed with User : "+user.PublicID)
    return user.PublicID
  }

  override property set Callback(callbackHandler : AuthenticationServicePluginCallbackHandler) {

  }
}