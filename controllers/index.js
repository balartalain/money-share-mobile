import MockHeroku from './fake'
import HerokuAPI from './prod'
import { OFFLINE } from '../utils'

const Heroku = OFFLINE ? MockHeroku : HerokuAPI
console.log(MockHeroku)
export default Heroku