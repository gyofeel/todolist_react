import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Head, Body, AddForm, LoginForm} from './components';

// class App extends Component {
//   state = {
//     data :[

//     ]
//   }

//   componentDidMount() {
//     fetch('/data')
//       .then(res => res.json())
//       .then(data => this.setState({ data }));
//   }

//   render() {
//     return (
//       <div className="App">
//       <h1>?????????????????????????</h1>
//         <Head/>
//         {/* {this.state.data.map(()=>) */}
//       </div>
//     );
//   }
// }
const App = ({store}) =>
  <div className="App">
    <Head store={store} />
    <Body store={store}/>
    <AddForm store={store}/>
    <LoginForm store={store}/>
  </div>

export default App;
