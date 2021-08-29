require('dotenv').config({ path: './env/local/.env' })


const Seneca = require('seneca')
const Model = require('../../model/model.json')
const TasksCollection = require('./tasks')


const Nock = require('nock')
//
// We only want our locally-mounted system to be able
// to make local connections, and not external ones.
//
Nock.disableNetConnect()
Nock.enableNetConnect('localhost')


const seneca = Seneca({ log: 'flat' })
seneca.context.model = Model

seneca
  .test('print')
  .error(console.log)
  .use('promisify')
  .use('entity')
  .use('mem-store')
  .use('search-mem', {
    search: {
      fields: ['name'],
      storeFields: ['name', 'version', 'giturl', 'desc', 'readme'],
      searchOptions: {
        fuzzy: true
      }
    }
  })
  .use('repl')
  .use('reload')
  .use('user')
  .use('member')
  .use('group')


const host = process.env.SMTP_HOST

if (null == host) {
  throw new Error('missing SMTP_HOST env var')
}


const port = process.env.SMTP_PORT

if (null == port) {
  throw new Error('missing SMTP_PORT env var')
}


const user = process.env.SMTP_USER

if (null == user) {
  throw new Error('missing SMTP_USER env var')
}


const pass = process.env.SMTP_PASS

if (null == pass) {
  throw new Error('missing SMTP_PASS env var')
}


seneca.use('simple-mail', {
  transport: {
    pool: true,
    secure: false, // <-- You might want to change that.
    host,
    port,
    auth: {
      user,
      pass
    }
  }
})


const npm_registry_url = process.env.NPM_REGISTRY_URL

if (null == npm_registry_url) {
  throw new Error('missing NPM_REGISTRY_URL env var')
}


const github_api_url = process.env.GITHUB_API_URL

if (null == github_api_url) {
  throw new Error('missing process env var')
}


const options = {
  npm_registry_url,
  github_api_url,

  ingester: {
    sleep_ms_between_iterations: 5e3,
    sleep_ms_between_fetches: 1e3
  },

  github_srv: {
    wait_ms_on_npm: 2e3
  }
}

for(const [name, srv] of Object.entries(Model.main.srv)) {
  seneca.use('../../srv/'+name+'/'+name+'-srv.js', options)
}


seneca.ready(() => {
  // NOTE: Creating the Premium Users group.
  //
  seneca.act('make:group,role:group', {
    owner_id: null,
    group: { name: 'Premium Users', mark: 'pu', code: 'PremiumUsers' },
    unique: true
  }, err => {
    if (err) {
      throw err
    }
  })

  // NOTE: Scheduling the tasks.
  //
  TasksCollection.run({ seneca })
})

