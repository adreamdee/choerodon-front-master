import React, { Component } from 'react';
import esModule from './esModule';

function transformInjects(getInjects, inject) {
  if (typeof getInjects === 'function') {
    return { [inject.getStoreName()]: inject[0] };
  } else if (typeof getInjects === 'object') {
    const result = {};
    Object.keys(getInjects).forEach((key, i) => {
      result[key] = inject[i];
    });
    return result;
  }
  return {};
}
function getInjectDataFetchers(getInjects) {
  if (typeof getInjects === 'function') {
    return [getInjects()];
  } else if (typeof getInjects === 'object') {
    return Object.keys(getInjects).map((key) => getInjects[key]());
  } else {
    return [];
  }
}
export default function asyncRouter(getComponent, getInjects, extProps, callback) {
  return class AsyncRoute extends Component {
    constructor() {
      super();
      this.state = {
        Cmp: null,
        injects: {},
      };
    }

    loadData = async () => {
      const injectDataFetchers = getInjectDataFetchers(getInjects);
      const [componentData, ...injectData] = await Promise.all([
        getComponent ? getComponent() : null,
        ...injectDataFetchers,
      ]);
      this.setState({
        Cmp: esModule(componentData),
        injects: transformInjects(getInjects, esModule(injectData)),
      }, callback);
    }

    componentDidMount() {
      this.loadData();
    }

    render() {
      const { Cmp, injects } = this.state;
      return Cmp && <Cmp {...({ ...extProps, ...this.props, ...injects })} />;
    }
  };
}
