import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();
    
    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    
    this.state = {
      fishes: {},
      order: {}
    };
  }
  
  componentWillMount() {
    // This runs right before the <App> is rendered.
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
    
    // Check local storage for orders.
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
    
    if(localStorageRef) {
      // Update our <App> component's order state.
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  } 
  
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  
  componentWillUpdate(nextProps, nextState) {
    //console.log({nextProps, nextState});
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }
  
  addFish(fish) {
    // Copy of existing state using spread.
    const fishes = {...this.state.fishes}
    // Add in new fish.
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // Set state.
    this.setState({ fishes });
  }
  
  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }
  
  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({ fishes });
  }
  
  addToOrder(key) {
    // Copy of existing state using spread.
    const order = {...this.state.order}
    // Update on add the number of fish ordered.
    order[key] = order[key] + 1 || 1;
    // Update state.
    this.setState({ order });
  }
  
  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order })
  }
  
  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }
  
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order 
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory 
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          fishes={this.state.fishes}
          loadSamples={this.loadSamples}
        />
      </div>
    )
  }
}

export default App;
