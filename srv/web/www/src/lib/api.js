import Axios from 'axios'


// TODO: Do not hardcode this.
//
const api = Axios.create({ baseURL: 'http://localhost:9000/seneca/' })


class Api {
  static async listPkgHistory(args) {
    const { auth_token, name, since } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }

    return api.post('/listPkgHistory', { name, since }, { headers })
  }


  static async loginUser(args) {
    const { email, pass } = args
    return api.post('/loginUser', { email, pass })
  }


  static async logoutUser(args) {
    const { auth_token } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }

    return api.post('/logoutUser', {}, { headers })
  }


  static async isPkgBookmarkedByMe(args) {
    const { auth_token, name } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }

    return api.post('/isPkgBookmarkedByMe', { name }, { headers })
  }


  static async listPkgsWithNamePrefix(args) {
    const { prefix } = args
    return api.post('/listPkgsWithNamePrefix', { prefix })
  }


  static async listMyBookmarkedPkgs(args = {}) {
    const { auth_token } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }


    return api.post('/listMyBookmarkedPkgs',
      {},
      { headers })
  }


  static async doBookmarkPkg(args) {
    const { auth_token } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }


    const { name } = args

    return api.post('/doBookmarkPkg', { name }, { headers })
  }


  static async showPkg(args) {
    const { name } = args
    return api.post('/showPkg', { name })
  }
}


export default Api
