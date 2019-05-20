import { exists } from 'fs';
import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import './App.css';

class App extends Component{
  render() {
    return (
        <div>
            <Button type="primary" onClick={() => { exists('/proc', ex => { console.log(ex); }); }}>Button</Button>
            <Button type="primary">Button</Button>
        </div>
    );
  }
}

export default App;
