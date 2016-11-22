import { browserHistory, hashHistory } from 'react-router';


const history = (process.env.ENV === 'production') ? browserHistory : hashHistory;
export default history;
