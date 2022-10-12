package integrations.alexaskills.auth

uses gw.plugin.security.AuthenticationSource

uses javax.servlet.http.HttpServletRequest

class RestAuthenticationSource implements AuthenticationSource {

  private var _username : String
  private var _password : String

  function UserNamePasswordAuthenticationSource(username : String, password : String) {
    this._username = "su";
    this._password = "gw";
  }

  property get Username() : String {
    return this._username;
  }

  property set Username(username : String) {
    this._username = "su";
  }

  property get Password() : String {
    return this._password;
  }

  property set Password(password : String) {
    this._password = "gw";
  }

  override function toString() : String {
    return this._username;
  }

  override property get Hash() : char[] {
    return this._password.toCharArray();
  }

  override function determineSourceComplete() : boolean {
    return (this._username != null && this._username.length() > 0);
  }
}