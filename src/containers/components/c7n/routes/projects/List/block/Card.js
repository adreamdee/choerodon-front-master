import React from 'react';
import { Avatar, Tooltip } from 'choerodon-ui';
import { Action } from '../../../../../../../index';
import PROJECT_TYPE from '../../constant';

const Card = ({ handleEditProject, handleClickProject, handleEnabledProject, dataSet, record, ...props }) => {
  const { name, code, imageUrl, applicationName, category, createUserImageUrl, createUserName, creationDate } = props;

  function handleFocus() {
    const index = dataSet.findIndex(r => r.get('code') === code);
    if (index !== -1) {
      dataSet.locate(index);
      handleEditProject();
    }
  }

  function handleClick() {
    if (!record.get('status')) {
      return;
    }
    handleClickProject(record);
  }

  function handleEnabled() {
    const index = dataSet.findIndex(r => r.get('code') === code);
    if (index !== -1) {
      dataSet.locate(index);
      handleEnabledProject();
    }
  }
  
  function renderAction() {
    const actionDatas = [
      { service: [], icon: '', text: '编辑', action: handleFocus },
      { service: [], icon: '', text: record.get('enabled') ? '停用' : '启用', action: handleEnabled },
    ];
    return <Action data={actionDatas} style={{ marginLeft: 5, flexShrink: 0 }} />;
  }

  return (
    <div className="pro-card">
      <div className="border-top" />
      <Tooltip title={record.get('enabled') ? '启用' : '停用'} placement="bottomRight">
        <div className="card-content" role="none" onClick={handleClick}>
          <Avatar size={80} src={imageUrl} style={{ fontSize: '32px' }}>{name && name.charAt(0)}</Avatar>
          <h3>{name}</h3>
          <div>
            {/* <span className="text link-text">{applicationName || '无关联应用'}</span>
            <span className="text separator">·</span> */}
            <span className="text">{code}</span>
            <span className="text separator">·</span>
            <span className="text">{PROJECT_TYPE[category]}</span>
          </div>
        </div>
      </Tooltip>
      <div className="card-footer">
        <div className="card-footer-left">
          <Avatar size={18} style={{ marginRight: 8, flexShrink: 0 }} src={createUserImageUrl}>
            {createUserName ? createUserName.charAt(0) : ''}
          </Avatar>
          <span className="text user">{createUserName || '创建用户未知'}</span>
          <span className="text separator">·</span>
          <span className="text date">{creationDate}</span>
        </div>
        {renderAction()}
      </div>
    </div>
  );
};

export default Card;
