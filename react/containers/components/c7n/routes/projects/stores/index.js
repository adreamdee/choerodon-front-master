import React, { createContext, useMemo, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import ListDataSet from './ListDataSet';
import useStore from './useStore';
import CategoryDataSet from './CategoryDataSet';

const Store = createContext();

export default Store;

export const StoreProvider = withRouter(injectIntl(inject('AppState', 'HeaderStore', 'MenuStore')(
  (props) => {
    const { AppState: { currentMenuType: { type, id, organizationId } }, intl, children, AppState, history } = props;
    const [showType, setShowType] = useState('table');
    const [auto, setAuto] = useState(true);
    const [isNotRecent, setIsNotRecent] = useState('all');
    const categoryDs = useMemo(() => new DataSet(CategoryDataSet(AppState, history)), [type, id, organizationId]);
    const dataSet = useMemo(() => new DataSet(ListDataSet(AppState, history, categoryDs)), [type, id, organizationId]);
    const projectStore = useStore();

    useEffect(() => {
      if (organizationId) {
        projectStore.checkCreate(organizationId);
      }
    }, [type, id, organizationId]);

    const value = {
      ...props,
      prefixCls: 'c7n-projects',
      // intlPrefix: 'c7n-projects',
      dataSet,
      toggleShowType(st) {
        setShowType(st);
      },
      toggleRecent(inr) {
        setIsNotRecent(inr);
      },
      showType,
      isNotRecent,
      auto,
      setAuto,
      projectStore,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
)));
